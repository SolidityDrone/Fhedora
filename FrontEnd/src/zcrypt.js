import React, { useEffect } from 'react';
import Minizip from 'minizip-asm.js';

import uploadFileToIPFS from './ipfs-helper.js';
import { client, contract, provider } from './App.js';
import {hexlify, toUtf8Bytes, toBigInt, getNumber} from 'ethers';
import {EncryptedType,EncryptionTypes, EncryptedUint32} from 'fhenixjs'

function FileUpload({ file, name, description, price, maxSupply }) {
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const fileContent = e.target.result;
      const mz = new Minizip();
      const textBuffer = new Uint8Array(fileContent);

      const password = generateRandomPassword(16);
      const passwordParts = splitPassword(password);
      const uintValues = convertToUint(passwordParts);

      const encryptedItems = await encryptItems(uintValues);

      mz.append(file.name, textBuffer, { password });
      const newZipData = mz.zip();

      try {
        // Upload the file to IPFS
        const ipfsCID = await uploadFileToIPFS(newZipData);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        const tx = await contract.createId(encryptedItems, ipfsCID.path, price, maxSupply, accounts[0], name);
        console.log(tx);
        console.log("File uploaded to IPFS:", ipfsCID);
      } catch (error) {
        console.error('Error uploading file to IPFS:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let password = '';
    for (let i = 0; i < length; i++) {
      password += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return password;
  }

  async function encryptItems(uintValues) {
    const encryptedItems = [];
    for (let i = 0; i < uintValues.length; i++) {
      const item = await client.encrypt(uintValues[i], EncryptionTypes.uint32);
      encryptedItems.push(item.data);
    }
    return encryptedItems;
  }

  function splitPassword(password) {
    const partSize = Math.ceil(password.length / 4); // Divide password into 8 parts
    const passwordParts = [];
    for (let i = 0; i < 4; i++) {
      const startIndex = i * partSize;
      const endIndex = Math.min(startIndex + partSize, password.length);
      const part = password.substring(startIndex, endIndex);
      // Encode part to bytes32 format
      const bytes32Part = hexlify(toUtf8Bytes(part)).padEnd(66, '0');
      passwordParts.push(bytes32Part);
    }
    return passwordParts;
  }

  function convertToUint(passwordParts) {
    const uintValues = [];
    passwordParts.forEach(part => {
      // Remove trailing zeros
      const trimmedPart = part.replace(/0+$/, '');
      // Convert to uint
      const uintValue = getNumber(toBigInt(trimmedPart));
      uintValues.push(uintValue);
    });
    return uintValues;
  }

  return null;
}

export default FileUpload;
