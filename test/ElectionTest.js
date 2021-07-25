const { expectRevert } = require("@openzeppelin/test-helpers");

const Election = artifacts.require("Election");
const MainContract = artifacts.require("MainContract");

contract("MainContract Test", accounts => {

  it("should create election", async () => {
    const instance = await MainContract.new();
    const sender = accounts[0];

    await instance.createElection(["US Election", "US presidential election"], ["Satoshi", "Bush"], {from: sender});

    const electionAddress =  await instance.Elections(0);
    const electionId = (await instance.electionId()).toString();

    assert.equal(web3.utils.isAddress(electionAddress), true);
    assert.equal(electionId, 1);
  });
});

contract("Election Test", accounts => {
  // var instance;

  // beforeEach(async () => {
  //   const sender = accounts[1];
  //   instance = await Election.new(["US Election", "US presidential election"], ["Satoshi", "Bush"], {from: sender});
  // })

  it("fails if candidates list is 0", async () => {
    const sender = accounts[1];
    await expectRevert(Election.new(["US Election", "US presidential election"], [], {from: sender}), "There should be atleast 1 candidate.");
  });

  it("should add candidate", async () => {
    const sender = accounts[0];
    const instance = await Election.new(["US Election", "US presidential election"], ["Satoshi", "Bush"], {from: sender})

    const candidate = await instance.candidates(0);
    const candidatesCount = await instance.candidatesCount();

    assert.equal(candidate.id, 0);
    assert.equal(candidate.name, "Satoshi");
    assert.equal(candidate.voteCount, 0);
    assert.equal(candidatesCount, 2);
  });

  it("should initialize state variables", async () => {
    const sender = accounts[0];
    const instance = await Election.new(["US Election", "US presidential election"], ["Satoshi", "Bush"], {from: sender});

    const name = await instance.name();
    const description = await instance.description();

    assert.equal(name, "US Election");
    assert.equal(description, "US presidential election");
  });

  it("fails if voter already voted", async () => {
    const sender = accounts[0];
    const instance = await Election.new(["US Election", "US presidential election"], ["Satoshi", "Bush"], {from: sender});
    const voter = accounts[1];

    await instance.vote(0, {from: voter});

    await expectRevert(instance.vote(0, {from: voter}), "Voter has already Voted!");
  });

  it("fails if candidate is invalid", async () => {
    const sender = accounts[0];
    const instance = await Election.new(["US Election", "US presidential election"], ["Satoshi", "Bush"], {from: sender});
    const voter = accounts[1];

    await expectRevert(instance.vote(6, {from: voter}), "Invalid candidate to Vote!");
  });

  it("should vote for candidate", async () => {
    const sender = accounts[0];
    const instance = await Election.new(["US Election", "US presidential election"], ["Satoshi", "Bush"], {from: sender});
    const voter = accounts[1];

    await instance.vote(0, {from: voter});

    const voted = await instance.voters(voter);
    const candidate = await instance.candidates(0);

    assert.equal(voted, true);
    assert.equal(candidate.voteCount, 1);
  });
});
