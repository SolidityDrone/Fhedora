import { FhenixClient, getPermit, EncryptedType,EncryptionTypes, EncryptedUint32 } from 'fhenixjs';
import { getAddress, BrowserProvider,toBeHex,toUtf8String, ethers, utils} from 'ethers';
import { contractAddress, client, contract, permission } from './App.js';


async function ProcessSealArray(tokenId) {
  try {
    const sealarray = await contract.sealEncKey(permission, tokenId);
    const decryptedArray = await Promise.all(sealarray.map(async (sealedValue) => {
      return client.unseal(contractAddress, sealedValue);
    }));

    let reconstructedPassword = '';
    for (let i = 0; i < decryptedArray.length; i++) {
      reconstructedPassword += toUtf8String(toBeHex(decryptedArray[i]));
    }

    console.log("Reconstructed Password:", reconstructedPassword);

    return reconstructedPassword;
  } catch (error) {
    console.error('Error processing seal array:', error);
    throw error;
  }
}

export default ProcessSealArray;
