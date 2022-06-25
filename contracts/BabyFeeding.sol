// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;
import "./Babies.sol";
import "./KittyInterface.sol";

/**
  Give babies ability to feed themselves.
  @notice only parents can feed babies
  */
contract BabyFeeding is Babies {
  KittyInterface cryptoKitties;

  function setKittyAddresss(address _kittyAddress) public {
    cryptoKitties = KittyInterface(_kittyAddress);
  }

  function feedAndMultiply(uint _babyId, uint _targetDna, string memory species) public {
    require(babyToParent[_babyId] == msg.sender, "You are not the parent of this baby");
    Baby storage baby = babies[_babyId];
    uint newDna = (baby.dna * _targetDna) % dnaModulus;
    _giveBirthToABaby("No name yet", newDna);
  }

  function feedOnKitty(uint _babyId, uint _kittyId) external {
    require(babyToParent[_babyId] == msg.sender, "You are not the parent of this baby");
    uint _targetDna;
    (,,,,,,,,,_targetDna) = cryptoKitties.getKitty(_kittyId);
    feedAndMultiply(_babyId, _targetDna, "kitty");
  }
}