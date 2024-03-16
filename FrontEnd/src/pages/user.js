import React, { useState, useEffect } from 'react';
import { contract } from '../App.js';
import ProcessSealArray from '../ProcessSealArray.js';
const User = () => {
  const [userEvents, setUserEvents] = useState([]);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        // Get current user's account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentUserAccount = accounts[0];

        // Fetch all events emitted by the contract for KeyAquired
        const allEvents = await contract.queryFilter('KeyAquired');

        // Filter events based on the current user's account
        const userEvents = allEvents.filter(event => event.args.owner.toLowerCase() === currentUserAccount.toLowerCase());

        // Set userEvents state
        setUserEvents(userEvents);
      } catch (error) {
        console.error('Error fetching user events:', error);
      }
    };

    fetchUserEvents();
  }, []); // Fetch events once on component mount

  const handleSearch = async () => {
    try {
      // Fetch all events emitted by the contract for IdCreation
      const allEvents = await contract.queryFilter('IdCreation');

      // Filter events based on the search address
      const results = allEvents.filter(event => event.args.creator.toLowerCase() === searchAddress.toLowerCase());

      // Set searchResults state
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching user events:', error);
    }
  };
  const goToIPFS = (cid) => {
    window.open(`https://ipfs.io/ipfs/${cid}`, '_blank');
  };

  const handleMint = async (tokenId, price) => {
    try {
      console.log(tokenId, price);
      // Launch transaction to mint token
      const transaction = await contract.mint(tokenId, {
        value: price
      });

      // Wait for transaction to be mined
      await transaction.wait();

      // Log success message
      console.log(`Token ${tokenId} minted successfully!`);
    } catch (error) {
      console.error('Error minting token:', error);
    }
  };


  const handleProcessSealArray = async (tokenId) => {
    try {
      const reconstructedPassword = await ProcessSealArray(tokenId);
      console.log("Reconstructed Password:", reconstructedPassword);
      // Do something with the reconstructed password, such as displaying it or using it for further processing
    } catch (error) {
      console.error('Error processing seal array:', error);
    }
  };
  return (
    <div>
      <h1>User Page</h1>
      <p>This is a placeholder for the user page.</p>

      {/* Search bar */}
      <input
        type="text"
        value={searchAddress}
        onChange={(e) => setSearchAddress(e.target.value)}
        placeholder="Enter creator address"
      />
      <button onClick={handleSearch}>Search</button>

      {/* Table for IdCreation events */}
      <div>
        <h2>IdCreation Events</h2>
        <ul>
          {searchResults.length > 0 ? (
            searchResults.map((event, index) => (
              <li key={index}>
                {/* Display event data */}
                <p>Token ID: {event.args.tokenId}</p>
                <p>Creator: {event.args.creator}</p>
                {/* Add any other details you want to display */}
                <button onClick={() => handleMint(event.args.tokenId, event.args.etherPrice)}>Mint</button>
              </li>
            ))
          ) : (
            <p>No events found for the provided address.</p>
          )}
        </ul>
      </div>

      {/* Table for KeyAquired events */}
      <div>
        <h2>KeyAquired Events</h2>
        <ul>
          {userEvents.map((event, index) => (
            <li key={index} style={{ listStyleType: 'none', marginBottom: '10px' }}>
              {/* Display event data */}
              <p style={{ display: 'inline-block', marginRight: '20px' }}>Token ID: {event.args.tokenId}</p>
              <p style={{ display: 'inline-block', marginRight: '20px' }}>
                CID: 
                <span title={event.args.CID} style={{ cursor: 'pointer' }}>
                  {`${event.args.CID.substring(0, 8)}...${event.args.CID.substring(event.args.CID.length - 4)}`}
               
                  <button onClick={() => goToIPFS(event.args.CID)} style={{ marginLeft: '5px' }}>Download</button>
                </span>
              </p>
              {/* Additional button to process seal array */}
              <button onClick={() => handleProcessSealArray(event.args.tokenId)}>Process Seal Array</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default User;
