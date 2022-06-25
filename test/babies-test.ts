import {expect} from 'chai';
import { Contract } from 'ethers';
import { waffle, ethers } from 'hardhat';
import KittyInterfaceJson from "../artifacts/contracts/KittyInterface.sol/KittyInterface.json";
const {deployMockContract, provider} = waffle;


describe("Babies", function () {
  let babies: Contract;
  let babyFeeding: Contract;
  this.beforeEach(async () => {
    // Get the contract instance
    const Babies = await ethers.getContractFactory("Babies");
    babies = await Babies.deploy();
    await babies.deployed();

    const BabyFeeding = await ethers.getContractFactory("BabyFeeding");
    babyFeeding = await BabyFeeding.deploy();
    await babyFeeding.deployed();
  });

  // It should give birth to a new baby and raise NewBaby event
  it("should give birth to a new baby and raise NewBaby event", async () => {

    await expect(babies.giveBirthToTheNewBaby("Vera"))
    .to.emit(babies, "NewBaby")
    .withArgs(0, "Vera", 4266458729405973);
    
    // Expect new event
    babies.on("NewBaby", (babyName, babyId) => {
      expect(babyName).to.equal("Vera");
      expect(babyId).to.equal(1);
    });
  })

  it("should let parent give bith to a baby only once", async () => {
    await babies.giveBirthToTheNewBaby("Vera");
    await expect(babies.giveBirthToTheNewBaby("Vera"))
    .to.be.revertedWith("Baby already given birth");
  })

  it("should let only the parent feed the baby", async () => {
    const signers = await ethers.getSigners();
    const otherAccount = signers[1];
    await babies.giveBirthToTheNewBaby("Vera");
    
    await expect(babyFeeding.connect(otherAccount).feedAndMultiply(0, 111111111111111, "baby"))
    .to.be.revertedWith("You are not the parent of this baby");
  })

  it("should feed on kitties", async() => {
    const [contractDeployer] = provider.getWallets();
    // deploy the contract to Mock
    const kittyContract = await deployMockContract(contractDeployer, KittyInterfaceJson.abi);
    await kittyContract.mock.getKitty.returns(0, 0, 0, 0, 0, 0, 0, 0, 0, 1111111111);

    // Set CK address
    await babyFeeding.setKittyAddresss(kittyContract.address);

    await babyFeeding.giveBirthToTheNewBaby("Vera");
    await babyFeeding.feedOnKitty(0, 111111111111111);
    const {dna} = await babyFeeding.babies(0)
    expect(dna).to.equal(4266458729405973);
  })

});
