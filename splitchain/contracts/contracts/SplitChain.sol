// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SplitChain {
    uint256 public constant MAX_MEMBERS = 20;
    uint256 public constant MAX_PARTICIPANTS = 20;

    error NotGroupMember();
    error InvalidGroup();
    error InvalidAddress();
    error DuplicateMember();
    error InvalidAmount();
    error InvalidSplit();
    error InvalidParticipants();
    error NotAuthorized();
    error InvalidSettlementState();
    error InsufficientOwedAmount();
    error SelfSettlement();

    struct Group { uint256 id; address creator; uint64 createdAt; bool active; string title; }
    struct Expense { uint256 id; uint256 groupId; address payer; uint256 totalAmount; uint64 createdAt; bytes32 descriptionHash; }
    struct Settlement { uint256 id; uint256 groupId; address debtor; address creditor; uint256 amount; uint64 createdAt; uint8 status; bytes32 referenceHash; }

    uint256 public nextGroupId = 1;
    uint256 public nextExpenseId = 1;
    uint256 public nextSettlementId = 1;

    mapping(uint256 => Group) private groups;
    mapping(uint256 => address[]) private groupMembers;
    mapping(uint256 => mapping(address => bool)) public isMember;
    mapping(uint256 => Expense) private expenses;
    mapping(uint256 => address[]) private expenseParticipants;
    mapping(uint256 => uint256[]) private expenseShares;
    mapping(uint256 => uint256[]) private groupExpenseIds;
    mapping(uint256 => Settlement) private settlements;
    mapping(uint256 => uint256[]) private groupSettlementIds;
    // Positive means receive; negative means owe.
    mapping(uint256 => mapping(address => int256)) private memberNetBalance;
    mapping(uint256 => mapping(address => uint256)) private pendingOutgoing;
    mapping(uint256 => mapping(address => uint256)) private pendingIncoming;
    // Direct gross debt ledger; confirmed settlements reduce the debtor->creditor pair.

    event GroupCreated(uint256 indexed groupId, address indexed creator, bytes32 titleHash, uint64 timestamp);
    event MemberAdded(uint256 indexed groupId, address indexed member, address indexed addedBy);
    event ExpenseAdded(uint256 indexed groupId, uint256 indexed expenseId, address indexed payer, uint256 totalAmount, uint64 timestamp);
    event SettlementProposed(uint256 indexed settlementId, uint256 indexed groupId, address indexed debtor, address creditor, uint256 amount);
    event SettlementConfirmed(uint256 indexed settlementId, uint256 indexed groupId, address indexed debtor, address creditor, uint256 amount);
    event SettlementRejected(uint256 indexed settlementId, uint256 indexed groupId, address indexed debtor, address creditor);
    event GroupClosed(uint256 indexed groupId);

    modifier onlyMember(uint256 groupId) {
        if (!isMember[groupId][msg.sender]) revert NotGroupMember();
        if (!groups[groupId].active) revert InvalidGroup();
        _;
    }

    function createGroup(string calldata title, address[] calldata initialMembers) external returns (uint256) {
        bytes memory titleBytes = bytes(title);
        if (titleBytes.length == 0 || titleBytes.length > 50) revert InvalidGroup();
        if (initialMembers.length + 1 > MAX_MEMBERS) revert InvalidParticipants();
        uint256 groupId = nextGroupId++;
        groups[groupId] = Group(groupId, msg.sender, uint64(block.timestamp), true, title);
        isMember[groupId][msg.sender] = true;
        groupMembers[groupId].push(msg.sender);
        for (uint256 i = 0; i < initialMembers.length; i++) {
            address member = initialMembers[i];
            if (member == address(0)) revert InvalidAddress();
            if (isMember[groupId][member]) revert DuplicateMember();
            isMember[groupId][member] = true;
            groupMembers[groupId].push(member);
        }
        emit GroupCreated(groupId, msg.sender, keccak256(bytes(title)), uint64(block.timestamp));
        for (uint256 i = 0; i < initialMembers.length; i++) emit MemberAdded(groupId, initialMembers[i], msg.sender);
        return groupId;
    }

    function addMember(uint256 groupId, address member) external onlyMember(groupId) {
        if (msg.sender != groups[groupId].creator) revert NotAuthorized();
        if (member == address(0)) revert InvalidAddress();
        if (isMember[groupId][member]) revert DuplicateMember();
        if (groupMembers[groupId].length >= MAX_MEMBERS) revert InvalidParticipants();
        isMember[groupId][member] = true;
        groupMembers[groupId].push(member);
        emit MemberAdded(groupId, member, msg.sender);
    }

    function closeGroup(uint256 groupId) external onlyMember(groupId) {
        if (msg.sender != groups[groupId].creator) revert NotAuthorized();
        groups[groupId].active = false;
        emit GroupClosed(groupId);
    }

    function getGroup(uint256 groupId) external view returns (Group memory) {
        if (groups[groupId].id == 0) revert InvalidGroup();
        return groups[groupId];
    }
    function getMembers(uint256 groupId) external view returns (address[] memory) {
        if (groups[groupId].id == 0) revert InvalidGroup();
        return groupMembers[groupId];
    }

    function addExpense(
        uint256 groupId, address payer, uint256 totalAmount,
        address[] calldata participants, uint256[] calldata shares, bytes32 descriptionHash
    ) external onlyMember(groupId) returns (uint256) {
        if (totalAmount == 0) revert InvalidAmount();
        if (!isMember[groupId][payer]) revert InvalidParticipants();
        if (participants.length == 0 || participants.length > MAX_PARTICIPANTS || participants.length != shares.length) revert InvalidParticipants();
        uint256 sum;
        for (uint256 i = 0; i < participants.length; i++) {
            if (!isMember[groupId][participants[i]] || participants[i] == address(0)) revert InvalidParticipants();
            if (shares[i] == 0) revert InvalidSplit();
            for (uint256 j = 0; j < i; j++) if (participants[j] == participants[i]) revert InvalidParticipants();
            sum += shares[i];
        }
        if (sum != totalAmount) revert InvalidSplit();

        uint256 expenseId = nextExpenseId++;
        expenses[expenseId] = Expense(expenseId, groupId, payer, totalAmount, uint64(block.timestamp), descriptionHash);
        groupExpenseIds[groupId].push(expenseId);
        memberNetBalance[groupId][payer] += int256(totalAmount);
        for (uint256 i = 0; i < participants.length; i++) {
            expenseParticipants[expenseId].push(participants[i]);
            expenseShares[expenseId].push(shares[i]);
            memberNetBalance[groupId][participants[i]] -= int256(shares[i]);
        }
        emit ExpenseAdded(groupId, expenseId, payer, totalAmount, uint64(block.timestamp));
        return expenseId;
    }

    function getExpense(uint256 expenseId) external view returns (Expense memory) {
        if (expenses[expenseId].id == 0) revert InvalidGroup();
        return expenses[expenseId];
    }
    function getExpenseShares(uint256 expenseId) external view returns (address[] memory, uint256[] memory) {
        if (expenses[expenseId].id == 0) revert InvalidGroup();
        return (expenseParticipants[expenseId], expenseShares[expenseId]);
    }
    function getGroupExpenseIds(uint256 groupId) external view returns (uint256[] memory) {
        if (groups[groupId].id == 0) revert InvalidGroup();
        return groupExpenseIds[groupId];
    }
    function getGroupSettlementIds(uint256 groupId) external view returns (uint256[] memory) {
        if (groups[groupId].id == 0) revert InvalidGroup();
        return groupSettlementIds[groupId];
    }
    function getMemberNetBalance(uint256 groupId, address member) external view returns (int256) {
        if (groups[groupId].id == 0) revert InvalidGroup();
        if (!isMember[groupId][member]) revert NotGroupMember();
        return memberNetBalance[groupId][member];
    }

    function proposeSettlement(uint256 groupId, address creditor, uint256 amount, bytes32 referenceHash) external onlyMember(groupId) returns (uint256) {
        if (amount == 0) revert InvalidAmount();
        if (creditor == msg.sender) revert SelfSettlement();
        if (!isMember[groupId][creditor]) revert InvalidParticipants();
        int256 debtorNet = memberNetBalance[groupId][msg.sender];
        int256 creditorNet = memberNetBalance[groupId][creditor];
        if (debtorNet >= 0 || creditorNet <= 0) revert InsufficientOwedAmount();
        uint256 debtorAvailable = uint256(-debtorNet);
        uint256 creditorAvailable = uint256(creditorNet);
        if (pendingOutgoing[groupId][msg.sender] > debtorAvailable || pendingIncoming[groupId][creditor] > creditorAvailable || amount > debtorAvailable - pendingOutgoing[groupId][msg.sender] || amount > creditorAvailable - pendingIncoming[groupId][creditor]) revert InsufficientOwedAmount();
        pendingOutgoing[groupId][msg.sender] += amount;
        pendingIncoming[groupId][creditor] += amount;
        uint256 settlementId = nextSettlementId++;
        settlements[settlementId] = Settlement(settlementId, groupId, msg.sender, creditor, amount, uint64(block.timestamp), 0, referenceHash);
        groupSettlementIds[groupId].push(settlementId);
        emit SettlementProposed(settlementId, groupId, msg.sender, creditor, amount);
        return settlementId;
    }

    function confirmSettlement(uint256 settlementId) external {
        Settlement storage s = settlements[settlementId];
        if (s.id == 0 || s.status != 0) revert InvalidSettlementState();
        if (msg.sender != s.creditor) revert NotAuthorized();
        int256 debtorNet = memberNetBalance[s.groupId][s.debtor];
        int256 creditorNet = memberNetBalance[s.groupId][s.creditor];
        if (debtorNet >= 0 || creditorNet <= 0 || pendingOutgoing[s.groupId][s.debtor] > uint256(-debtorNet) || pendingIncoming[s.groupId][s.creditor] > uint256(creditorNet)) revert InsufficientOwedAmount();
        s.status = 1;
        pendingOutgoing[s.groupId][s.debtor] -= s.amount;
        pendingIncoming[s.groupId][s.creditor] -= s.amount;
        memberNetBalance[s.groupId][s.debtor] += int256(s.amount);
        memberNetBalance[s.groupId][s.creditor] -= int256(s.amount);
        emit SettlementConfirmed(settlementId, s.groupId, s.debtor, s.creditor, s.amount);
    }
    function rejectSettlement(uint256 settlementId) external {
        Settlement storage s = settlements[settlementId];
        if (s.id == 0 || s.status != 0) revert InvalidSettlementState();
        if (msg.sender != s.creditor) revert NotAuthorized();
        s.status = 2;
        pendingOutgoing[s.groupId][s.debtor] -= s.amount;
        pendingIncoming[s.groupId][s.creditor] -= s.amount;
        emit SettlementRejected(settlementId, s.groupId, s.debtor, s.creditor);
    }
    function getSettlement(uint256 settlementId) external view returns (Settlement memory) {
        if (settlements[settlementId].id == 0) revert InvalidSettlementState();
        return settlements[settlementId];
    }
}
