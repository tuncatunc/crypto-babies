import {expect} from 'chai';
import { ethers } from 'hardhat';
import '../artifacts/contracts/Babies.sol/Babies.json';

describe("Babies", function () {
  // It should give birth to a new baby and raise NewBaby event
  it("should give birth to a new baby and raise NewBaby event", async () => {
    // Get the contract instance
    const Babies = await ethers.getContractFactory("Babies");
    const babies = await Babies.deploy();
    await babies.deployed();

    await expect(babies.giveBirthToTheNewBaby("Vera"))
    .to.emit(babies, "NewBaby")
    .withArgs(0, "Vera", 4266458729405973);
    
    // Expect new event
    babies.on("NewBaby", (babyName, babyId) => {
      expect(babyName).to.equal("Vera");
      expect(babyId).to.equal(1);
    });
  })

});
