// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

contract Babies {
  // @notice number of digits in the baby's dna
  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;

  struct Baby {
    string name;
    uint dna;
  }

  Baby[] public babies;
  mapping(uint => address) public babyToParent;
  mapping(address => uint) public parentToBabyCount;

  event NewBaby(uint _babyId, string _name, uint _dna);

  // @notice create a new baby
  function _giveBirthToABaby(string memory _name, uint _dna) internal {
    
    babies.push(Baby(_name, _dna));
    uint babyId = babies.length - 1;

    babyToParent[babyId] = msg.sender;
    parentToBabyCount[msg.sender]++;

    emit NewBaby(babyId, _name, _dna);
  }

  function _generateRandomDna(string memory _str) private view returns (uint){
   return uint(keccak256(abi.encode(_str))) % dnaModulus;
  }

  // @notice give bith to a baby
  // @notice 
  function giveBirthToTheNewBaby(string memory _name) public  {
    require(parentToBabyCount[msg.sender] == 0, "Baby already given birth");
    _giveBirthToABaby(_name, _generateRandomDna(_name));
  }
}