// SPDX-License-Identifier: MIT
// Description: ERC20 contract with support for encrypted balance and transfer.
//  ______   ______   __       __   _____    __   ______  __  __       _____    ______   ______   __   __   ______   
// /\  ___\ /\  __ \ /\ \     /\ \ /\  __-. /\ \ /\__  _\/\ \_\ \     /\  __-. /\  == \ /\  __ \ /\ "-.\ \ /\  ___\  
// \ \___  \\ \ \/\ \\ \ \____\ \ \\ \ \/\ \\ \ \\/_/\ \/\ \____ \    \ \ \/\ \\ \  __< \ \ \/\ \\ \ \-.  \\ \  __\  
//  \/\_____\\ \_____\\ \_____\\ \_\\ \____- \ \_\  \ \_\ \/\_____\    \ \____- \ \_\ \_\\ \_____\\ \_\\"\_\\ \_____\
//   \/_____/ \/_____/ \/_____/ \/_/ \/____/  \/_/   \/_/  \/_____/     \/____/  \/_/ /_/ \/_____/ \/_/ \/_/ \/_____/

pragma solidity ^0.8.19;

import { ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { FHE, euint32, inEuint32 } from "@fhenixprotocol/contracts/FHE.sol";
import { Permissioned, Permission } from "@fhenixprotocol/contracts/access/Permission.sol";
import { Clones } from "@openzeppelin/contracts/proxy/Clones.sol";

contract Fhe is ERC1155, Permissioned {
    
    mapping(address => uint) public _IdToCreator;
    mapping(uint=>TokenInfo) public _tokenInfo;
    mapping(uint=>euint32[4]) public _tokenAuthKey;
    uint256 internal counter;

    event IdCreation(address indexed creator, uint tokenId,  string CID,  uint etherPrice, uint maxSupply, string name);
    event KeyAquired(address indexed owner, uint tokenId, string CID);

    struct TokenInfo {
        address owner;
        address receiver;
        string name;
        string tokenCID;
        uint maxSupply;
        uint currentSupply;
        uint ethersPrice;
    }

    modifier onlyTokenOwner(uint tokenId){
        require(balanceOf(msg.sender, tokenId) > 0);
        _;
    }

    constructor(string memory uri)
        ERC1155(uri){}


    
    function sealEncKey(Permission memory permission, uint256 tokenId) public view /*onlyTokenOwner(tokenId)*/ onlySignedPublicKey(permission)  returns (bytes[] memory){
        bytes[] memory seals = new bytes[](4);
        for (uint i; i < 4; i++){
            seals[i] = FHE.sealoutput(_tokenAuthKey[tokenId][i], permission.publicKey);
        }
        return seals;
    }
    
    function mint(uint256 tokenId) public  payable {
        require(msg.value == _tokenInfo[tokenId].ethersPrice);
        require(_tokenInfo[tokenId].currentSupply < _tokenInfo[tokenId].maxSupply, "Supply cap met!" );
        _mint(msg.sender, tokenId, 1, "");
        ++_tokenInfo[tokenId].currentSupply;
        address receiver = _tokenInfo[tokenId].receiver;
        (bool success, ) = receiver.call{value: msg.value}("");
        require(success, "Failed to send ether. Execution reverted");

        emit KeyAquired(msg.sender, tokenId, _tokenInfo[tokenId].tokenCID);
    }
 
    function  createId( bytes[] memory encKey, string memory CID, uint maxSupply, uint price, address receiver, string memory name) public {
        ++counter;
        _IdToCreator[msg.sender];

        TokenInfo memory info;
        info.tokenCID = CID;
        info.name = name;
        info.receiver = receiver;
        info.owner = msg.sender;
        info.maxSupply = maxSupply;
        info.ethersPrice = price;
        for (uint i; i < encKey.length; i++){
            _tokenAuthKey[counter][i] = FHE.asEuint32(encKey[i]);
        }
        _tokenInfo[counter] = info;


        emit IdCreation(msg.sender, counter,  CID,  price, maxSupply,  name);
    }
   

    function getSealedArray(euint32[] memory encSlot, Permission memory permission) public pure returns (bytes[] memory){
        bytes[] memory bytesValues = new bytes[](8);
        for (uint i; i < 8; i++){
            bytesValues[i] = getSealedByte4(encSlot[i], permission);
        }
        return bytesValues; 
    }

    function getSealedByte4(euint32 encValue, Permission memory permission) internal pure returns (bytes memory){
        return FHE.sealoutput(encValue, permission.publicKey);
    }

   function uint32ToString(uint32 _uint32) public pure returns (string memory) {
    bytes memory result = new bytes(4);
    result[0] = bytes1(uint8(_uint32 >> 24));
    result[1] = bytes1(uint8(_uint32 >> 16));
    result[2] = bytes1(uint8(_uint32 >> 8));
    result[3] = bytes1(uint8(_uint32));

    return string(result);
}


    // naive way to make a sbt like 
    function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes memory data) public override {
        uint senderBalance = balanceOf(msg.sender, id);
        super.safeTransferFrom(from, to, id, value, data);
        require(!(balanceOf(msg.sender, id) < senderBalance), "Transfer disabled");
    }



    // // ////////////////////////////////////////////////////
    // // these functions are here just for testing purpose//
    // // ////////////////////////////////////////////////////
    // // function bytesToString(bytes memory data) public pure returns (string memory) {
    // //     bytes memory stringBuffer = new bytes(data.length);
    // //     for (uint i = 0; i < data.length; i++) {
    // //         stringBuffer[i] = data[i];
    // //     }
    // //     return string(stringBuffer);
    // // }
    // // function bytes4ToUint32(bytes4 _bytes4) public pure returns (uint32) {
    // //     uint32 result;
    // //     for (uint32 i = 0; i < 4; i++) {
    // //         result |= uint32(uint8(_bytes4[i])) << (8 * i);
    // //     }
    // //     return result;
    // // }

    // //   Function to convert bytes4 to string
    // // function bytes4ToString(bytes4 _bytes4) public pure returns (string memory) {
    // // }
    
    // // Function to convert string to bytes4
    // // function stringToBytes4(string memory _str) public pure returns (bytes4) {
    // //     bytes memory byteArray = bytes(_str);
    // //     bytes4 result;
    // //     assembly {
    // //         result := mload(add(byteArray, 32))
    // //     }
    // //     return result;
    // // }
}