import { expect } from "chai";
import { ethers } from "hardhat";

describe("SplitChain", function () {
  async function deploy() {
    const [a,b,c,outsider] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("SplitChain");
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    return { contract,a,b,c,outsider };
  }
  it("creates a group and adds members", async function () {
    const {contract,a,b,c}=await deploy();
    await expect(contract.connect(a).createGroup("Trip",[b.address,c.address])).to.emit(contract,"GroupCreated");
    expect(await contract.getMembers(1)).to.deep.equal([a.address,b.address,c.address]);
  });
  it("rejects non-admin member additions", async function () {
    const {contract,a,b,c}=await deploy();
    await contract.connect(a).createGroup("Trip",[b.address]);
    await expect(contract.connect(b).addMember(1,c.address)).to.be.revertedWithCustomError(contract,"NotAuthorized");
  });
  it("records expenses and calculates net balances in paise", async function () {
    const {contract,a,b,c}=await deploy();
    await contract.connect(a).createGroup("Trip",[b.address,c.address]);
    await contract.connect(a).addExpense(1,a.address,90000,[a.address,b.address,c.address],[30000,30000,30000],ethers.ZeroHash);
    expect(await contract.getMemberNetBalance(1,a.address)).to.equal(60000);
    expect(await contract.getMemberNetBalance(1,b.address)).to.equal(-30000);
    expect(await contract.getMemberNetBalance(1,c.address)).to.equal(-30000);
  });
  it("only creditor can confirm and only confirmed settlement changes balance", async function () {
    const {contract,a,b,c}=await deploy();
    await contract.connect(a).createGroup("Trip",[b.address,c.address]);
    await contract.connect(a).addExpense(1,a.address,90000,[a.address,b.address,c.address],[30000,30000,30000],ethers.ZeroHash);
    const tx=await contract.connect(b).proposeSettlement(1,a.address,10000,ethers.ZeroHash);
    await tx.wait();
    expect(await contract.getMemberNetBalance(1,b.address)).to.equal(-30000);
    await expect(contract.connect(c).confirmSettlement(1)).to.be.revertedWithCustomError(contract,"NotAuthorized");
    await contract.connect(a).confirmSettlement(1);
    expect(await contract.getMemberNetBalance(1,b.address)).to.equal(-20000);
  });
  it("passes the complete shared trip settlement vector", async function () {
    const {contract,a,b,c}=await deploy();
    await contract.connect(a).createGroup("Weekend Trip",[b.address,c.address]);
    await contract.connect(a).addExpense(1,a.address,90000,[a.address,b.address,c.address],[30000,30000,30000],ethers.ZeroHash);
    await contract.connect(b).addExpense(1,b.address,60000,[a.address,b.address,c.address],[20000,20000,20000],ethers.ZeroHash);
    expect(await contract.getMemberNetBalance(1,a.address)).to.equal(40000);
    expect(await contract.getMemberNetBalance(1,b.address)).to.equal(10000);
    expect(await contract.getMemberNetBalance(1,c.address)).to.equal(-50000);
    await contract.connect(c).proposeSettlement(1,a.address,40000,ethers.ZeroHash);
    await contract.connect(a).confirmSettlement(1);
    expect(await contract.getMemberNetBalance(1,a.address)).to.equal(0);
    expect(await contract.getMemberNetBalance(1,b.address)).to.equal(10000);
    expect(await contract.getMemberNetBalance(1,c.address)).to.equal(-10000);
    await contract.connect(c).proposeSettlement(1,b.address,10000,ethers.ZeroHash);
    await contract.connect(b).confirmSettlement(2);
    expect(await contract.getMemberNetBalance(1,a.address)).to.equal(0);
    expect(await contract.getMemberNetBalance(1,b.address)).to.equal(0);
    expect(await contract.getMemberNetBalance(1,c.address)).to.equal(0);
  });
  it("reserves balances for pending settlements to prevent over-proposal", async function () {
    const {contract,a,b}=await deploy();
    await contract.connect(a).createGroup("Trip",[b.address]);
    await contract.connect(a).addExpense(1,a.address,10000,[a.address,b.address],[5000,5000],ethers.ZeroHash);
    await contract.connect(b).proposeSettlement(1,a.address,5000,ethers.ZeroHash);
    await expect(contract.connect(b).proposeSettlement(1,a.address,1,ethers.ZeroHash)).to.be.revertedWithCustomError(contract,"InsufficientOwedAmount");
  });
  it("rejects invalid share totals", async function () {
    const {contract,a,b}=await deploy();
    await contract.connect(a).createGroup("Trip",[b.address]);
    await expect(contract.connect(a).addExpense(1,a.address,100,[a.address,b.address],[40,40],ethers.ZeroHash)).to.be.revertedWithCustomError(contract,"InvalidSplit");
  });
  it("prevents outsider writes", async function () {
    const {contract,a,outsider}=await deploy();
    await contract.connect(a).createGroup("Trip",[]);
    await expect(contract.connect(outsider).addExpense(1,a.address,100,[a.address],[100],ethers.ZeroHash)).to.be.revertedWithCustomError(contract,"NotGroupMember");
  });
});
