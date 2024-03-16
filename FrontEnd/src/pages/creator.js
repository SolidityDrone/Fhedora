import React, { useState, useEffect } from 'react';
import { ethers, formatUnits} from 'ethers';
import Form from './form';
import { contract } from '../App.js';

const Creator = () => {
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        // Get current user's account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentUserAccount = accounts[0];
  
        // Fetch all events emitted by the contract
        const allEvents = await contract.queryFilter('IdCreation');
        
        // Filter events based on the current user's account
        const userEvents = allEvents.filter(event => event.args.creator.toLowerCase() === currentUserAccount.toLowerCase());
        
        // Set userEvents state
        setUserEvents(userEvents);
      } catch (error) {
        console.error('Error fetching user events:', error);
      }
    };
  
    fetchUserEvents();
  }, []); // Fetch events once on component mount

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const goToIPFS = (cid) => {
    window.open(`https://ipfs.io/ipfs/${cid}`, '_blank');
  };
  
  return (
    <div>
      <h1>Creator Page</h1>
      <p>This is a placeholder for the Creator page.</p>
      <Form />
      <div>
        <h2>User Events</h2>
        <ul>
          {userEvents.map((event, index) => (
            <li key={index} style={{ listStyleType: 'none', marginBottom: '10px' }}>
              {/* Display event data */}
              <p style={{ display: 'inline-block', marginRight: '20px' }}>Token ID: {event.args.tokenId}</p>
              <p style={{ display: 'inline-block', marginRight: '20px' }}>
                CID: 
                <span title={event.args.CID} style={{ cursor: 'pointer' }}>
                  {`${event.args.CID.substring(0, 8)}...${event.args.CID.substring(event.args.CID.length - 4)}`}
                  <button onClick={() => copyToClipboard(event.args.CID)} style={{ marginLeft: '5px' }}>Copy</button>
                  <button onClick={() => goToIPFS(event.args.CID)} style={{ marginLeft: '5px' }}>Download</button>
                </span>
              </p>
              <p style={{ display: 'inline-block', marginRight: '20px' }}>Price: {formatUnits(event.args.etherPrice, 'ether')} ethers</p>
              <p style={{ display: 'inline-block' }}>Max Supply: {event.args.maxSupply}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Creator;