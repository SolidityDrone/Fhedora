// ipfs-helper.js

import { create as ipfsHttpClient } from 'ipfs-http-client';

async function uploadFileToIPFS(file) {
const projectId = "2XzdpH760vNI6DiGSPKT684ABXG";
const projectSecret = "50832dae5bf23852a5c42a1df78b90e3";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    }
});


    try {
        const result = await ipfs.add(file);
        return {
            cid: result.cid,
            path: result.path,
        };
    } catch (error) {
        throw new Error('Error uploading file to IPFS:', error);
    }


}
export default uploadFileToIPFS;
