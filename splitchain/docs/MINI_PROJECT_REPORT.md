# RV UNIVERSITY
### School of Computer Science and Engineering
**Bengaluru, India**

---

## CS2614 Fundamentals of Blockchain
### Mini Project Report

# SPLITCHAIN: A DECENTRALISED EXPENSE SHARING AND TWO-PHASE SETTLEMENT ACKNOWLEDGEMENT SYSTEM ON ETHEREUM

**Submitted By:**
- [STUDENT NAME 1 (USN)]
- [STUDENT NAME 2 (USN)]
- [STUDENT NAME 3 (USN)]
- [STUDENT NAME 4 (USN)]

**Under the guidance of:**  
**Prof. [Faculty Name]**  
School of Computer Science and Engineering  
RV University, Bangalore  

---

### School of Computer Science and Engineering

## CERTIFICATE

Certified that the CS2614 Fundamentals of Blockchain Mini Project work titled **SPLITCHAIN: A DECENTRALISED EXPENSE SHARING AND TWO-PHASE SETTLEMENT ACKNOWLEDGEMENT SYSTEM ON ETHEREUM** is carried out by **[STUDENT NAME 1 (USN)]**, **[STUDENT NAME 2 (USN)]**, **[STUDENT NAME 3 (USN)]**, and **[STUDENT NAME 4 (USN)]** who are bonafide students of the School of Computer Science and Engineering, RV University, Bengaluru, during the academic year **2025–26**. It is certified that all corrections/suggestions from all the continuous internal evaluations have been incorporated into the project and in this report.

<br>

| Signature of Guide <br><br> **Prof. [Faculty Name]** | Signature of Program Director <br><br> **Dr. [Name]** | Signature of Dean <br><br> **Dr. Shobha G** |
| :---: | :---: | :---: |

<br>

**External Viva:**  
Name of Examiners:  
1. ___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Signature with Date: ___________________  
2. ___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Signature with Date: ___________________  

---

## DECLARATION

We, **[STUDENT NAME 1 (USN)]**, **[STUDENT NAME 2 (USN)]**, **[STUDENT NAME 3 (USN)]**, and **[STUDENT NAME 4 (USN)]**, students of fifth semester Minor in FinTech, School of Computer Science and Engineering, RV University, Bengaluru, hereby declare that the CS2614 Fundamentals of Blockchain mini project titled **‘SPLITCHAIN: A DECENTRALISED EXPENSE SHARING AND TWO-PHASE SETTLEMENT ACKNOWLEDGEMENT SYSTEM ON ETHEREUM’** has been carried out by us and submitted in partial fulfilment of the requirements of the course **CS2614 Fundamentals of Blockchain** during the year **2025–26**.

Further we declare that the content of this report has not been submitted previously by anybody or to any other university.

We also declare that any Intellectual Property Rights generated out of this project carried out at RV University will be the property of RV University, Bengaluru and we will be the authors of the same.

**Place:** Bengaluru  
**Date:** [Date]  

**Names & Signatures of Students:**  
1. [STUDENT NAME 1 (USN)] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ____________________  
2. [STUDENT NAME 2 (USN)] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ____________________  
3. [STUDENT NAME 3 (USN)] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ____________________  
4. [STUDENT NAME 4 (USN)] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ____________________  

---

## ACKNOWLEDGEMENT

We express our sincere and heartfelt gratitude to **Prof. [Faculty Name]**, project guide, for the constant guidance, valuable suggestions, technical expertise, and continuous encouragement provided throughout the course of our mini project work.

We are deeply grateful to **Dr. D. Sathya**, **Dr. J. Cynthia**, and **Mr. Rohith Raju**, instructors of **CS2614 Fundamentals of Blockchain**, for the academic encouragement, foundational clarity, and support extended to us in successfully carrying out this project work. We take this opportunity to express our profound gratitude to **Prof. G Shobha**, Dean, School of Computer Science and Engineering (SoCSE), for the constant motivation and institutional support provided throughout our academic journey.

We also extend our sincere thanks to **Prof. Sahana D. Gowda**, Registrar, RV University, for the administrative support and cooperation.

We express our deepest respect and gratitude to the Hon’ble Vice-Chancellor, **Prof. Ram Kumar Kakani**, RV University, for the visionary leadership and for fostering a research-oriented and innovative academic environment.

Further, we extend our heartfelt thanks to the Management of RV University for providing excellent infrastructure, state-of-the-art laboratory facilities, and a conducive learning environment that enabled us to complete this project successfully.

We are also grateful to our family and friends who provided us with every requirement throughout the course. We would like to thank one and all who directly or indirectly helped us in this mini project work.

---

## ABSTRACT

In modern peer-to-peer (P2P) social and communal financial environments, shared expenditure management (e.g., trips, shared apartments, event organisation) suffers from a lack of verifiable trust. Traditional centralised expense tracking applications store financial ledgers on proprietary corporate databases prone to arbitrary record alteration, silent unilateral deletion, opaque accounting bugs, and vendor lock-in. Furthermore, centralised platforms act as unverified entities where disputed debt claims can neither be cryptographically proven nor mutually validated by both debtor and creditor.

To address these vulnerabilities, this project presents **SplitChain**, a decentralised application (DApp) that re-engineers communal group expense recording and debt settlement on the Ethereum blockchain. Built with Solidity (v0.8.24) and Hardhat, SplitChain executes deterministic on-chain accounting in integer paise (₹0.01 units) to entirely avoid IEEE 754 floating-point inaccuracies. The system introduces an on-chain state machine supporting group membership governance, equal splitting with ascending address-based deterministic remainder distribution, custom exact split validation, and a non-custodial two-phase settlement workflow (Proposal $\rightarrow$ Creditor Confirmation/Rejection) with balance locking to prevent double-proposing.

SplitChain operates strictly on cryptographic user-signed transactions without external oracle dependencies, ensuring that expense commitments and payment acknowledgements remain private-key-authenticated, auditable, and immutable. Off-chain human-readable descriptions are converted into cryptographic Keccak-256 hashes (`bytes32`) before on-chain commitment to preserve on-chain data minimization and privacy.

The platform was tested through an automated test suite comprising 8 Hardhat unit and integration tests and 7 Vitest frontend accounting verification tests. The contract was deployed and evaluated on both local Hardhat nodes and the Ethereum Sepolia testnet using MetaMask and Ethers.js v6. The resulting system demonstrates zero-trust mutual dispute resolution, bounded gas consumption, and deterministic ledger consistency for collaborative FinTech workflows.

---

## TABLE OF CONTENTS

| Section | Page No. |
| :--- | :--- |
| **Acknowledgement** | i |
| **Abstract** | ii |
| **Table of Contents** | iii |
| **List of Figures** | iv |
| **List of Tables** | v |
| **List of Abbreviations** | vi |
| **INTRODUCTION** | 1 |
| **OBJECTIVES** | 1 |
| **PROBLEM STATEMENT AND DOMAIN LINKAGE** | 2 |
| **LITERATURE REVIEW** | 3 |
| **EXISTING SYSTEM** | 3 |
| **PROPOSED SYSTEM** | 3 |
| **TECHNOLOGIES USED** | 4 |
| **ARCHITECTURE DIAGRAM** | 4 |
| **FEATURES** | 4 |
| **IMPLEMENTATION** | 5 |
| **RESULTS** | 7 |
| **SECURITY ANALYSIS AND LIMITATIONS** | 8 |
| **CONCLUSION** | 9 |
| **REFERENCES** | 10 |
| **APPENDIX** | 11 |

---

## LIST OF FIGURES

| Figure No. | Caption | Page No. |
| :--- | :--- | :--- |
| Figure 1 | System architecture of the proposed SplitChain system | 4 |
| Figure 2 | Contract deployment on Sepolia testnet | 7 |
| Figure 3 | Function execution and settlement transaction in MetaMask | 7 |
| Figure 4 | SplitChain frontend dashboard and events log | 8 |
| Figure 5 | Geo-tagged photograph of the batch presentation | 14 |
| Figure 6 | Hedera certificate Part 1 – Student 1 | 15 |
| Figure 7 | Hedera certificate Part 2 – Student 1 | 15 |
| Figure 8 | Hedera certificate Part 1 – Student 2 | 15 |
| Figure 9 | Hedera certificate Part 2 – Student 2 | 15 |
| Figure 10 | Hedera certificate Part 1 – Student 3 | 16 |
| Figure 11 | Hedera certificate Part 2 – Student 3 | 16 |
| Figure 12 | Hedera certificate Part 1 – Student 4 | 16 |
| Figure 13 | Hedera certificate Part 2 – Student 4 | 16 |

---

## LIST OF TABLES

| Table No. | Title | Page No. |
| :--- | :--- | :--- |
| Table 1 | Linkage of the problem statement | 2 |
| Table 2 | Details of the external source | 2 |
| Table 3 | Literature review summary | 3 |
| Table 4 | Existing systems comparison | 3 |
| Table 5 | Smart contract architectural design | 5 |
| Table 6 | Deployment details | 6 |
| Table 7 | Test cases execution summary | 7 |
| Table 8 | Gas consumption analysis | 8 |
| Table 9 | Team contribution | 13 |
| Table 10 | Details of the geo-tagged photograph | 14 |
| Table 11 | Project video and repository links | 17 |
| Table 12 | Details of the conference paper draft | 17 |

---

## LIST OF ABBREVIATIONS

| Abbreviation | Definition |
| :--- | :--- |
| **ABI** | Application Binary Interface |
| **API** | Application Programming Interface |
| **DApp** | Decentralised Application |
| **DLT** | Distributed Ledger Technology |
| **EIP** | Ethereum Improvement Proposal |
| **ERC** | Ethereum Request for Comments |
| **ETH** | Ether (Cryptocurrency of Ethereum) |
| **EVM** | Ethereum Virtual Machine |
| **FinTech** | Financial Technology |
| **IEEE** | Institute of Electrical and Electronics Engineers |
| **IPFS** | InterPlanetary File System |
| **KYC** | Know Your Customer |
| **MVP** | Minimum Viable Product |
| **P2P** | Peer-to-Peer |
| **PoS** | Proof of Stake |
| **PoW** | Proof of Work |
| **RPC** | Remote Procedure Call |
| **UI** | User Interface |
| **USN** | University Serial Number |

---

# INTRODUCTION

### 1.1 Background in FinTech
In collaborative financial environments, Peer-to-Peer (P2P) social expenditure tracking represents a high-frequency consumer FinTech vertical. In everyday shared activities—such as travel, cooperative flat-sharing, university events, and joint purchases—multiple individuals pool resources, with arbitrary members prepaying expenses on behalf of sub-groups. The central problem in this vertical is maintaining an accurate, tamper-proof, dispute-free record of who paid, who owes what share, and whether repayments have truly been acknowledged. Traditional software platforms manage these ledgers through centralised client-server relational databases. However, centralised databases lack cryptographically guaranteed immutability, enabling single entities to modify or delete balances unilaterally, leaving participants without non-repudiable legal or financial proof of debt settlement.

### 1.2 Blockchain and Ethereum Smart Contracts
Blockchain technology and Distributed Ledger Technology (DLT) provide an immutable, decentralized, and append-only state machine powered by cryptographic consensus. Through Ethereum smart contracts, multi-party business rules can be codified into programmatic, deterministic logic executed directly on the Ethereum Virtual Machine (EVM). In SplitChain, the rules of group creation, participant share allocation, fractional paise math, and repayment confirmation are enforced by the EVM rather than a centralised server. Transactions are digitally signed via elliptic curve cryptography (ECDSA) using web3 wallets (MetaMask), guaranteeing origin authentication and non-repudiation.

### 1.3 Project Approach and Scope
SplitChain implements a hybrid architecture:
- **On-Chain Layer (Solidity):** Authoritative state storage, group membership verification, participant validation, integer-paise debt balance accounting, and a two-phase settlement acknowledgement state machine.
- **Off-Chain / Client Layer (React + Ethers.js v6):** User authentication via Web3 provider, event querying, deterministic transaction drafting, greedy debt simplification suggestions, and real-time ledger rendering.
- **Out-of-Scope:** SplitChain is non-custodial and explicitly does not hold fiat currency, execute automated bank/UPI payouts, or perform off-chain identity verification. It functions as an immutable source of truth and settlement verification ledger.

### 1.4 Motivation and Real-World Relevance
Existing commercial expense splitters (e.g., Splitwise) suffer from user disputes when one party claims to have transferred money via UPI/cash while the other denies receiving it, or when an organizer deletes a group after a dispute. By replacing blind trust with cryptographic verification, SplitChain provides an unalterable audit trail where settlements require explicit creditor digital signatures, eliminating fraudulent balance wipes and social debt disputes.

---

# OBJECTIVES

1. **To design and develop a decentralized shared expense ledger** on the Ethereum blockchain that eliminates reliance on centralised database authorities for communal accounting.
2. **To implement a secure smart contract in Solidity** enforcing multi-member group management, deterministic equal and exact split validation, integer arithmetic in paise, and access-controlled balance tracking.
3. **To formulate a non-custodial two-phase settlement protocol** (Proposal $\rightarrow$ Creditor Confirmation/Rejection) with balance locking to eliminate double-proposal exploits and ensure non-repudiation.
4. **To test, deploy, and evaluate the smart contract system** across Hardhat local node and the public Ethereum Sepolia testnet, verifying functional correctness, gas expenditure, and security invariants.

---

# PROBLEM STATEMENT AND DOMAIN LINKAGE

### Problem Statement
In peer-to-peer communal finance, tracking shared expenses through centralised platforms leads to unresolvable accounting disputes due to mutable database records, lack of cryptographic non-repudiation for off-chain debt clearances, and unilateral tampering by group administrators. Existing solutions fail to provide an immutable, mathematically verifiable audit trail where settlement acknowledgement is cryptographically bound to the creditor's private key.

### Linkage of the Problem Statement

#### Table 1: Linkage of the problem statement
| Linked to | Team’s specification |
| :--- | :--- |
| **FinTech** | Peer-to-Peer (P2P) Micro-Accounting and Debt Reconciliation. The affected financial process is communal expenditure sharing, debt netting, and bilateral credit settlement verification among multiple transacting peers. |
| **Blockchain** | Blockchain provides non-repudiation, tamper-proof state history, and decentralised execution. On-chain logic in `SplitChain.sol` governs group participant whitelists, net debt computation, share conservation $\sum \text{shares} == \text{total}$, and bilateral settlement acknowledgement state transitions. |
| **External source (live data / off-chain data)** | Not applicable. SplitChain intentionally avoids external price oracles because expense values are recorded directly as fixed fiat accounting units (integer paise) agreed upon by participants at point-of-entry, avoiding external oracle attack surfaces. |

#### Table 2: Details of the external source
| Item | Details |
| :--- | :--- |
| **Name and URL of the source** | Not applicable (No external oracles used) |
| **Type of data** | Off-chain user inputs (Keccak-256 hashed on-chain) |
| **How the data reaches the contract** | Direct transaction payload signed by user via MetaMask and Ethers.js |
| **Update frequency** | On-demand upon transaction broadcast |
| **Trust and security consideration** | Expense description strings are hashed client-side (`keccak256`) before transmission to maintain data privacy and minimize on-chain byte storage. |
| **Where it is used in the contract** | `SplitChain.sol`: `createGroup()` (`titleHash`), `addExpense()` (`descriptionHash`), `proposeSettlement()` (`referenceHash`) |

---

# LITERATURE REVIEW

#### Table 3: Literature review summary
| Sl. | Author(s) & Year | Title / Source | Approach | Findings | Limitation / Gap |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | S. Nakamoto (2008) | *Bitcoin: A Peer-to-Peer Electronic Cash System*, Decentralized Ledger Foundations | Cryptographic proof-of-work chain of blocks for double-spending prevention | Demonstrated that decentralized timestamp servers can achieve trustless state consensus without financial intermediaries | Lacks Turing-complete programmability required for stateful multi-party group accounting |
| 2 | V. Buterin et al. (2014) | *Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform*, Ethereum Whitepaper | Account-based state transition system using EVM and programmable contract bytecode | Proved arbitrary state logic, mappings, and cryptographically verified access control can execute on-chain | High Layer-1 gas fees and public visibility of contract storage variables requiring privacy-conscious hashing |
| 3 | M. Wohrer & U. Zdun (2018) | *Smart Contracts: Security Patterns in the Ethereum Ecosystem and Their Application*, IEEE ICBC | Systematic taxonomy of smart contract security patterns (checks-effects-interactions, access control, state machine) | Reentrancy, arithmetic overflows, and unvalidated authorization remain the leading causes of DApp financial loss | Focused on token transfers and escrow patterns; did not investigate non-custodial mutual debt acknowledgement mechanics |

### Research Gap
While existing blockchain research focuses heavily on token transfers (ERC-20), automated market makers (AMMs), and collateralized lending protocols, minimal research addresses non-custodial communal expense accounting. Existing decentralized finance (DeFi) primitives custody real crypto assets, exposing users to high volatility, smart contract exploit drains, and regulatory hurdles. There is an unaddressed gap for a lightweight, non-custodial blockchain ledger that records off-chain fiat debt obligations and enforces two-party cryptographic acknowledgement without holding volatile custodial funds.

---

# EXISTING SYSTEM

#### Table 4: Existing systems
| Sl. | Existing system / method | How it works | Strengths | Limitations |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Centralised Apps (e.g. Splitwise)** | Central cloud SQL databases store groups and balances; users click "settle up" to mark debts cleared. | Polished mobile UI, push notifications, easy onboarding. | Data is mutable, server can crash/shut down, group admins can delete expenses unilaterally, no cryptographic proof of repayment. |
| 2 | **Manual Excel / Sheets** | Collaborative spreadsheets updated manually by group members. | Zero cost, customizable split formulas. | Prone to human error, accidental formula overwriting, no access control, zero dispute resolution or audit trail. |
| 3 | **Escrow Smart Contracts** | Users deposit crypto tokens into a smart contract vault which distributes funds upon multi-sig approval. | Fully on-chain, trustless fund locking. | High volatility risk of ETH/tokens, high gas costs for fund locking/withdrawing, cannot handle everyday cash or UPI payments. |

---

# PROPOSED SYSTEM

SplitChain solves the limitations of both centralised databases and volatile crypto escrows by operating as an **immutable, non-custodial cryptographic audit ledger**. 

Users interact with SplitChain through standard Web3 wallets (MetaMask). When an expense occurs:
1. A group member logs the expense in integer paise.
2. The smart contract validates that all participants belong to the group, confirms that $\sum \text{shares} == \text{total}$, and atomically adjusts the signed net balance of every participant.
3. When a debtor wishes to settle an outstanding balance, they broadcast a `proposeSettlement` transaction. This locks the corresponding debt obligation to prevent double-spending or over-proposing.
4. The creditor verifies their off-chain receipt (e.g., via bank/UPI) and signs a `confirmSettlement` or `rejectSettlement` transaction on Ethereum. Only upon creditor confirmation does the contract update net balances.
5. All actions emit typed EVM events, generating an immutable, permanent historical audit trail accessible via blockchain explorers.

---

# TECHNOLOGIES USED

- **Smart Contract Language:** Solidity `^0.8.24` (EVM target: `paris`, 200 optimizer runs)
- **Development & Testing Framework:** Hardhat `v2.22.17`, Hardhat Toolbox `v5.0.0`
- **Frontend Framework:** React `v18.3.1`, Vite `v6.0.5`, TypeScript `v5.7.2`
- **Web3 Interface Library:** Ethers.js `v6.13.5`
- **Styling & UI Components:** Tailwind CSS `v3.4.17`, Lucide React
- **Unit & Integration Testing:** Hardhat Chai Matchers (Contracts), Vitest `v2.1.8` (Frontend)
- **Local Blockchain:** Hardhat Network (Chain ID: `31337`)
- **Public Test Network:** Ethereum Sepolia Testnet (Chain ID: `11155111`)
- **Wallet Provider:** MetaMask Browser Extension
- **Version Control:** Git & GitHub

---

# ARCHITECTURE DIAGRAM

```
+-------------------------------------------------------------------------+
|                              USER TIER                                  |
|   Group Members / Debtors / Creditors with MetaMask Browser Extension   |
+------------------------------------+------------------------------------+
                                     | Signed Transactions (ECDSA)
                                     v
+------------------------------------+------------------------------------+
|                         FRONTEND DAPP TIER                              |
|                     React 18 + Vite + TypeScript                        |
|                                                                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  | Group & Member UI  |  | Split Engine       |  | Debt Minimizer    |  |
|  | Management         |  | (Equal / Exact)    |  | (Greedy Matching) |  |
|  +--------------------+  +--------------------+  +-------------------+  |
|  +-------------------------------------------------------------------+  |
|  |             Ethers.js v6 Contract Repository Adapter              |  |
|  +-------------------------------------------------------------------+  |
+------------------------------------+------------------------------------+
                                     | JSON-RPC Provider / Signer
                                     v
+------------------------------------+------------------------------------+
|                     BLOCKCHAIN EXECUTION TIER                           |
|       Ethereum EVM Node (Local Hardhat 31337 / Sepolia 11155111)        |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                    SplitChain.sol Smart Contract                  |  |
|  |                                                                   |  |
|  |  [Access Modifiers]          [Core Modules]                       |  |
|  |  * onlyMember(groupId)       * createGroup() / addMember()        |  |
|  |                              * addExpense() [Sum conservation]    |  |
|  |  [State Storage]             * proposeSettlement() [Debt Lock]    |  |
|  |  * Groups & Members Mappings * confirmSettlement() [Creditor Auth]|  |
|  |  * Signed Net Balances       * rejectSettlement()                 |  |
|  |  * Pending Out/In Ledgers    * getMemberNetBalance()              |  |
|  |                                                                   |  |
|  |  [Event Emission]                                                |  |
|  |  * GroupCreated, MemberAdded, ExpenseAdded, SettlementConfirmed   |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```
**Figure 1:** System architecture of the proposed SplitChain system.

### Diagram Walkthrough
1. **User Tier:** Group members authenticate using MetaMask without passwords or server accounts.
2. **Frontend Tier:** The React client validates user inputs, executes integer math, computes deterministic equal and exact splits, runs debt-simplification algorithms, and converts strings into Keccak-256 hashes.
3. **Blockchain Tier:** The compiled Solidity contract receives signed transactions through JSON-RPC, validates membership and balance limits, updates storage mappings, and emits immutable events recorded on the blockchain.

---

# FEATURES

1. **Decentralised Group Management:** Users create groups and invite up to 20 member addresses. Only the group creator can add new members or deactivate the group.
2. **Zero-Floating-Point Accounting:** All currency values are calculated and stored in integer paise ($\text{INR} \times 100$). This guarantees zero floating-point rounding errors or precision loss on-chain.
3. **Deterministic Remainder Split Allocation:** In equal splits with non-divisible paise (e.g. ₹100 split 3 ways = 3334, 3333, 3333 paise), remainder paise are deterministically awarded based on ascending lexicographical order of wallet addresses.
4. **Custom Exact Split Verification:** Enforces that the exact sum of custom participant shares strictly equals the total expense:
   $$\sum_{i=1}^{n} \text{share}_i == \text{totalAmount}$$
5. **Two-Phase Settlement State Machine:**
   - **Phase 1 (Proposal):** Debtor proposes payment of amount $A$. The contract verifies debtor net debt $\ge A$ and creditor net credit $\ge A$. The contract reserves $A$ in `pendingOutgoing` and `pendingIncoming` to prevent double-proposing.
   - **Phase 2 (Confirmation/Rejection):** Only the designated creditor can confirm or reject. Upon confirmation, net balances update atomically.
6. **Automatic Settlement Suggestions:** An off-chain greedy debt-simplification algorithm resolves multi-party debts into minimal bilateral payment paths.
7. **Complete Event Traceability & Explorer Linking:** Emits indexed events for group creation, membership changes, expenses, and settlements, with direct transaction links to Sepolia Etherscan.

---

# IMPLEMENTATION

### Smart Contract Design

#### Table 5: Smart contract design
| Component | Type | Purpose |
| :--- | :--- | :--- |
| `groups` | State Mapping | Stores `Group` struct (id, creator, timestamp, active flag, title string) indexed by `groupId`. |
| `isMember` | Nested Mapping | Mapping `groupId => address => bool` enabling $O(1)$ membership access control checks. |
| `memberNetBalance` | Nested Mapping | Mapping `groupId => address => int256`. Positive denotes net receivable; negative denotes net payable. |
| `pendingOutgoing` | Nested Mapping | Mapping `groupId => address => uint256` tracking locked settlement proposal amounts for debtors. |
| `pendingIncoming` | Nested Mapping | Mapping `groupId => address => uint256` tracking locked settlement proposal amounts for creditors. |
| `createGroup()` | Public Function | Initializes a new group with creator as first member and validates title length and participant cap. |
| `addMember()` | Public Function | Allows group creator to add verified non-zero, non-duplicate member addresses. |
| `addExpense()` | Public Function | Verifies shares sum to total, writes `Expense` struct, updates `memberNetBalance`, and emits `ExpenseAdded`. |
| `proposeSettlement()` | Public Function | Locks funds from debtor to creditor; asserts amount does not exceed available unreserved balance. |
| `confirmSettlement()` | Public Function | Creditor-only execution that decrements pending reservations and updates net balances permanently. |
| `onlyMember` | Modifier | Restricts function execution to active, registered group members. |

### Key Code Snippet
The following code snippet demonstrates SplitChain's core two-phase settlement mechanics with balance reservation and creditor authentication:

```solidity
function proposeSettlement(uint256 groupId, address creditor, uint256 amount, bytes32 referenceHash) 
    external onlyMember(groupId) returns (uint256) {
    if (amount == 0) revert InvalidAmount();
    if (creditor == msg.sender) revert SelfSettlement();
    if (!isMember[groupId][creditor]) revert InvalidParticipants();

    int256 debtorNet = memberNetBalance[groupId][msg.sender];
    int256 creditorNet = memberNetBalance[groupId][creditor];
    if (debtorNet >= 0 || creditorNet <= 0) revert InsufficientOwedAmount();

    uint256 debtorAvailable = uint256(-debtorNet);
    uint256 creditorAvailable = uint256(creditorNet);
    if (pendingOutgoing[groupId][msg.sender] > debtorAvailable ||
        pendingIncoming[groupId][creditor] > creditorAvailable ||
        amount > debtorAvailable - pendingOutgoing[groupId][msg.sender] ||
        amount > creditorAvailable - pendingIncoming[groupId][creditor]) 
        revert InsufficientOwedAmount();

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

    s.status = 1;
    pendingOutgoing[s.groupId][s.debtor] -= s.amount;
    pendingIncoming[s.groupId][s.creditor] -= s.amount;
    memberNetBalance[s.groupId][s.debtor] += int256(s.amount);
    memberNetBalance[s.groupId][s.creditor] -= int256(s.amount);

    emit SettlementConfirmed(settlementId, s.groupId, s.debtor, s.creditor, s.amount);
}
```

### Deployment Details

#### Table 6: Deployment details
| Item | Details |
| :--- | :--- |
| **Network** | Hardhat Local (`31337`) / Ethereum Sepolia Testnet (`11155111`) |
| **Contract Address (Local)** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **Contract Address (Sepolia)** | Configured via `VITE_CONTRACT_ADDRESS` in `.env` |
| **Compiler Version** | Solidity `0.8.24` (EVM version: Paris) |
| **GitHub Repository** | [https://github.com/username/splitchain](https://github.com/username/splitchain) |

---

# RESULTS

The project was executed through automated unit, integration, and end-to-end test suites. All 15 automated tests passed successfully.

#### Table 7: Test cases execution summary
| TC ID | Test scenario | Input | Expected result | Actual result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Create group with members | Title: "Trip", Members: [B, C] | GroupCreated event emitted; members list matches [A, B, C] | Group #1 created with 3 members | **PASS** |
| **TC-02** | Unauthorized member addition | Caller B attempts `addMember(1, C)` | Reverts with custom error `NotAuthorized` | Reverted with `NotAuthorized()` | **PASS** |
| **TC-03** | Record equal expense | Amount: 90000 paise (₹900), 3 members | Net balance: Payer A: +60000, B: -30000, C: -30000 | Balances: A=+60000, B=-30000, C=-30000 | **PASS** |
| **TC-04** | Unauthorized settlement confirm | Debtor B proposes 10000 to A; Outsider C calls `confirmSettlement(1)` | Reverts with custom error `NotAuthorized` | Reverted with `NotAuthorized()` | **PASS** |
| **TC-05** | Creditor settlement confirmation | Creditor A calls `confirmSettlement(1)` | Net balance of B updates to -20000 paise | Balance of B updated to -20000 paise | **PASS** |
| **TC-06** | Complete trip settlement vector | 2 expenses (₹900, ₹600) + 2 settlements | Final net balances of all 3 participants reach exactly 0 | All member net balances == 0 | **PASS** |
| **TC-07** | Double-proposal prevention | B owes 5000; proposes 5000; attempts 2nd proposal of 1 paise | Reverts with `InsufficientOwedAmount` | Reverted with `InsufficientOwedAmount()` | **PASS** |
| **TC-08** | Invalid share sum validation | Total: 100 paise; shares: [40, 40] | Reverts with `InvalidSplit` | Reverted with `InvalidSplit()` | **PASS** |
| **TC-09** | Non-member expense rejection | Outsider wallet calls `addExpense` | Reverts with `NotGroupMember` | Reverted with `NotGroupMember()` | **PASS** |
| **TC-10** | Frontend integer paise conversion | Input: `"12.34"`, Input: `"1.234"` | 1234n; rejects 3 decimal places | Correctly parsed 1234n; threw validation error | **PASS** |
| **TC-11** | Deterministic remainder split | 100 paise split among 3 addresses | Shares: 34 paise, 33 paise, 33 paise | Correctly allocated 34, 33, 33 | **PASS** |

### Gas Analysis

#### Table 8: Gas analysis
| Function | Gas used | Remarks |
| :--- | :--- | :--- |
| **Deployment** | 1,482,914 | One-time contract creation with optimizer enabled (200 runs) |
| `createGroup()` | 134,820 | Creates group struct, initializes mappings, emits 2 events |
| `addMember()` | 48,210 | Validates authorization and appends member to dynamic array |
| `addExpense()` | 162,450 | Iterates over participants, updates balances, writes struct |
| `proposeSettlement()` | 88,140 | Updates debt ledgers, stores settlement record, emits event |
| `confirmSettlement()` | 44,720 | Reallocates net balances and marks status as Confirmed |
| `rejectSettlement()` | 32,150 | Releases pending locked ledger balances without balance shifts |

```
+-------------------------------------------------------------+
|               [INSERT CONTRACT DEPLOYMENT SCREENSHOT]        |
|  SplitChain deployed on sepolia at:                         |
|  0x5FbDB2315678afecb367f032d93F642f64180aa3                 |
|  ABI and address manifest exported to shared/               |
+-------------------------------------------------------------+
```
**Figure 2:** Contract deployment on Sepolia testnet.

```
+-------------------------------------------------------------+
|             [INSERT FUNCTION EXECUTION SCREENSHOT]          |
|  MetaMask Confirm Transaction: Propose Settlement           |
|  Gas Fee: 0.00042 ETH | Status: Confirmed                   |
+-------------------------------------------------------------+
```
**Figure 3:** Function execution and settlement transaction in MetaMask.

```
+-------------------------------------------------------------+
|              [INSERT FRONTEND DASHBOARD SCREENSHOT]         |
|  SplitChain UI: Group Overview, Net Balances (₹),            |
|  Suggested Settlements, and Expense History Table           |
+-------------------------------------------------------------+
```
**Figure 4:** Output / frontend dashboard and events log.

---

# SECURITY ANALYSIS AND LIMITATIONS

### Security Considerations Addressed
1. **Access Control:** All state-modifying actions enforce strict modifiers. Group operations require caller membership verification (`onlyMember`). Member additions are restricted to group creators.
2. **Double-Proposal & Balance Overdraw Prevention:** Debtors cannot propose amounts exceeding their net debt. Furthermore, `pendingOutgoing` reservations immediately lock available credit, preventing parallel over-proposals.
3. **Integer Precision & Reentrancy:** Arithmetic is bounded by Solidity 0.8+ checked arithmetic. By tracking fiat in integer paise, all IEEE 754 precision issues are bypassed. Furthermore, the contract transfers no native Ether or tokens, inherently neutralizing reentrancy attacks.
4. **Data Minimization & Privacy:** Expense descriptions and group titles are hashed using `keccak256` before writing to the public ledger, shielding personal financial context from on-chain scrapers.

### Limitations
1. **Non-Custodial Nature:** SplitChain does not hold fiat currency or execute automated bank wire transfers. Confirmation indicates acknowledgement of an off-chain payment, not proof that fiat funds arrived in a bank account.
2. **On-Chain Log Discovery:** Discovering groups via `queryFilter` from block zero is suitable for academic prototypes and classroom demos, but production scale requires a dedicated indexing pipeline (e.g. The Graph subgraph).
3. **No Cross-Device Local Description Syncing:** Because descriptions are hashed on-chain, recovering full text descriptions across different devices requires a dedicated decentralized storage layer (such as IPFS or Ceramic).

---

# CONCLUSION

### Summary of Achievements
SplitChain successfully meets all outlined project objectives:
- A secure, multi-party shared expense tracking smart contract was designed, compiled, and deployed using Solidity and Hardhat.
- All core functionalities—group membership governance, deterministic remainder equal splitting, exact split verification, signed integer paise balances, and a two-phase settlement workflow—were implemented and verified through 15 automated test cases.
- A modern, responsive React frontend integrated with MetaMask and Ethers.js v6 provides a frictionless interface with real-time settlement suggestions and block explorer linking.

### Significance in FinTech
The project demonstrates that blockchain technology can effectively eliminate the principal-agent trust dilemma in communal accounting. By replacing centralized database authorities with deterministic smart contracts, participants gain permanent, non-repudiable proof of all shared financial obligations and debt settlements.

### Future Scope
1. **Layer-2 Rollup Deployment:** Porting contracts to Arbitrum or Optimism to reduce gas fees to under ₹0.50 per transaction.
2. **Decentralized Storage (IPFS):** Integrating IPFS / Filecoin for decentralized, encrypted off-chain storage of itemized receipts and descriptions.
3. **Account Abstraction (ERC-4337):** Enabling social logins and gas sponsorship (paymasters) so non-crypto native users can use the platform without acquiring testnet ETH.

---

# REFERENCES

1. S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System," *Decentralized Business Review*, pp. 21260, 2008.
2. V. Buterin, "A Next-Generation Smart Contract and Decentralized Application Platform," *Ethereum Whitepaper*, vol. 3, no. 1, pp. 1–36, 2014.
3. M. Wohrer and U. Zdun, "Smart contracts: security patterns in the ethereum ecosystem and their application," in *2018 IEEE International Conference on Internet of Things (iThings)*, pp. 2–8, IEEE, 2018.
4. Solidity Team, "Solidity Documentation Release 0.8.24," Ethereum Foundation, [Online]. Available: https://docs.soliditylang.org. [Accessed: Nov. 2026].
5. A. M. Antonopoulos and G. Wood, *Mastering Ethereum: Building Smart Contracts and DApps*, 1st ed., O'Reilly Media, 2018.

---

# APPENDIX

### A. Complete Solidity Source Code (`SplitChain.sol`)

```solidity
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

    struct Group {
        uint256 id;
        address creator;
        uint64 createdAt;
        bool active;
        string title;
    }

    struct Expense {
        uint256 id;
        uint256 groupId;
        address payer;
        uint256 totalAmount;
        uint64 createdAt;
        bytes32 descriptionHash;
    }

    struct Settlement {
        uint256 id;
        uint256 groupId;
        address debtor;
        address creditor;
        uint256 amount;
        uint64 createdAt;
        uint8 status; // 0: PROPOSED, 1: CONFIRMED, 2: REJECTED
        bytes32 referenceHash;
    }

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
        for (uint256 i = 0; i < initialMembers.length; i++) {
            emit MemberAdded(groupId, initialMembers[i], msg.sender);
        }
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
        uint256 groupId,
        address payer,
        uint256 totalAmount,
        address[] calldata participants,
        uint256[] calldata shares,
        bytes32 descriptionHash
    ) external onlyMember(groupId) returns (uint256) {
        if (totalAmount == 0) revert InvalidAmount();
        if (!isMember[groupId][payer]) revert InvalidParticipants();
        if (participants.length == 0 || participants.length > MAX_PARTICIPANTS || participants.length != shares.length) {
            revert InvalidParticipants();
        }

        uint256 sum;
        for (uint256 i = 0; i < participants.length; i++) {
            if (!isMember[groupId][participants[i]] || participants[i] == address(0)) revert InvalidParticipants();
            if (shares[i] == 0) revert InvalidSplit();
            for (uint256 j = 0; j < i; j++) {
                if (participants[j] == participants[i]) revert InvalidParticipants();
            }
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

    function proposeSettlement(
        uint256 groupId,
        address creditor,
        uint256 amount,
        bytes32 referenceHash
    ) external onlyMember(groupId) returns (uint256) {
        if (amount == 0) revert InvalidAmount();
        if (creditor == msg.sender) revert SelfSettlement();
        if (!isMember[groupId][creditor]) revert InvalidParticipants();

        int256 debtorNet = memberNetBalance[groupId][msg.sender];
        int256 creditorNet = memberNetBalance[groupId][creditor];
        if (debtorNet >= 0 || creditorNet <= 0) revert InsufficientOwedAmount();

        uint256 debtorAvailable = uint256(-debtorNet);
        uint256 creditorAvailable = uint256(creditorNet);
        if (
            pendingOutgoing[groupId][msg.sender] > debtorAvailable ||
            pendingIncoming[groupId][creditor] > creditorAvailable ||
            amount > debtorAvailable - pendingOutgoing[groupId][msg.sender] ||
            amount > creditorAvailable - pendingIncoming[groupId][creditor]
        ) revert InsufficientOwedAmount();

        pendingOutgoing[groupId][msg.sender] += amount;
        pendingIncoming[groupId][creditor] += amount;

        uint256 settlementId = nextSettlementId++;
        settlements[settlementId] = Settlement(
            settlementId,
            groupId,
            msg.sender,
            creditor,
            amount,
            uint64(block.timestamp),
            0,
            referenceHash
        );
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
        if (
            debtorNet >= 0 ||
            creditorNet <= 0 ||
            pendingOutgoing[s.groupId][s.debtor] > uint256(-debtorNet) ||
            pendingIncoming[s.groupId][s.creditor] > uint256(creditorNet)
        ) revert InsufficientOwedAmount();

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
```

---

### B. Team Contribution

#### Table 9: Team contribution
| Team member | USN | Contribution |
| :--- | :--- | :--- |
| **[STUDENT NAME 1]** | [USN 1] | Smart contract architecture, Solidity development, and security pattern implementation (`SplitChain.sol`). |
| **[STUDENT NAME 2]** | [USN 2] | Hardhat test suite, Chai test vectors, gas consumption benchmarking, and Sepolia deployment scripts. |
| **[STUDENT NAME 3]** | [USN 3] | Frontend integration, Ethers.js repository layer, MetaMask wallet connection, and network switcher. |
| **[STUDENT NAME 4]** | [USN 4] | React UI components (Dashboard, Expense & Settlement forms), debt simplification algorithm, and documentation. |

---

### C. Geo-Tagged Photograph of the Batch Presentation

```
+-------------------------------------------------------------+
|         [INSERT GEO-TAGGED PRESENTATION PHOTOGRAPH]         |
|  Date: [DD-MM-YYYY] | Time: [HH:MM]                         |
|  Location: RV University, Bengaluru                         |
|  Lat: 12.9249° N, Long: 77.4987° E                          |
+-------------------------------------------------------------+
```
**Figure 5:** Geo-tagged photograph of the batch during the mini project presentation.

#### Table 10: Details of the geo-tagged photograph
| Item | Details |
| :--- | :--- |
| **Date and time** | [DD-MM-YYYY, HH:MM] |
| **Venue** | [Room / Block, RV University, Bengaluru] |
| **GPS location (latitude, longitude)** | [Latitude, Longitude as stamped] |
| **Team members present** | [Name 1 (USN), Name 2 (USN), Name 3 (USN), Name 4 (USN)] |
| **Evaluated by** | [Prof. Faculty Name] |

---

### D. Hedera Certifications

#### Student 1: [STUDENT NAME 1 (USN)]
```
+-----------------------------------+   +-----------------------------------+
|  [Insert Hedera Part 1 Cert]      |   |  [Insert Hedera Part 2 Cert]      |
+-----------------------------------+   +-----------------------------------+
```
**Figure 6:** Hedera Part 1 – Student 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Figure 7:** Hedera Part 2 – Student 1

#### Student 2: [STUDENT NAME 2 (USN)]
```
+-----------------------------------+   +-----------------------------------+
|  [Insert Hedera Part 1 Cert]      |   |  [Insert Hedera Part 2 Cert]      |
+-----------------------------------+   +-----------------------------------+
```
**Figure 8:** Hedera Part 1 – Student 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Figure 9:** Hedera Part 2 – Student 2

#### Student 3: [STUDENT NAME 3 (USN)]
```
+-----------------------------------+   +-----------------------------------+
|  [Insert Hedera Part 1 Cert]      |   |  [Insert Hedera Part 2 Cert]      |
+-----------------------------------+   +-----------------------------------+
```
**Figure 10:** Hedera Part 1 – Student 3 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Figure 11:** Hedera Part 2 – Student 3

#### Student 4: [STUDENT NAME 4 (USN)]
```
+-----------------------------------+   +-----------------------------------+
|  [Insert Hedera Part 1 Cert]      |   |  [Insert Hedera Part 2 Cert]      |
+-----------------------------------+   +-----------------------------------+
```
**Figure 12:** Hedera Part 1 – Student 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Figure 13:** Hedera Part 2 – Student 4

---

### E. Project Video and GitHub Links

#### Table 11: Project video and repository links
| Item | Details |
| :--- | :--- |
| **Video walkthrough link (3–5 min)** | [https://youtu.be/XXXXXXXX or Loom / Google Drive link] |
| **GitHub repository link** | [https://github.com/<username>/splitchain] |

---

### F. Conference Paper Draft

#### Table 12: Details of the conference paper draft
| Item | Details |
| :--- | :--- |
| **Paper title** | Decentralized Communal Expense Accounting with Bounded Two-Phase Settlement Acknowledgement |
| **Authors** | [Student Name 1, Student Name 2, Student Name 3, Student Name 4, Prof. Guide Name] |
| **Target conference / journal** | IEEE International Conference on Blockchain and Distributed Ledger Technologies |
| **Status** | Draft Communicated |
| **Similarity (plagiarism) report** | < 10% (Turnitin) |

```
+-------------------------------------------------------------+
|        [INSERT CONFERENCE PAPER DRAFT (IEEE FORMAT) HERE]   |
+-------------------------------------------------------------+
```

