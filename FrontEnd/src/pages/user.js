import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contract } from '../App.js';
import ProcessSealArray from '../ProcessSealArray.js';

const User = () => {
  const [userEvents, setUserEvents] = useState([]);
  const [searchCreator, setSearchCreator] = useState('');

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

  const handleSearch = async () => {
    try {
      // Fetch all events emitted by the contract
      const allEvents = await contract.queryFilter('IdCreation');
      
      // Filter events based on the search creator's address
      const filteredEvents = allEvents.filter(event => event.args.creator.toLowerCase() === searchCreator.toLowerCase());
      
      // Set userEvents state with filtered events
      setUserEvents(filteredEvents);
    } catch (error) {
      console.error('Error searching user events:', error);
    }
  };

  return (
    <div>
      <h1>User Page</h1>
      <p>This is a placeholder for the user page.</p>

      {/* Search bar */}
      <input 
        type="text" 
        value={searchCreator} 
        onChange={(e) => setSearchCreator(e.target.value)} 
        placeholder="Search by creator address" 
      />
      <button onClick={handleSearch}>Search</button>

      {/* Table for IdCreation events */}
      <div>
        <h2>User Events - IdCreation</h2>
        <ul>
          {userEvents.map((event, index) => (
            <li key={index}>
              {/* Display event data */}
              <p>Token ID: {event.args.tokenId}</p>
              <p>CID: {event.args.CID}</p>
              {/* Add any other details you want to display */}
            </li>
          ))}
        </ul>
      </div>

      {/* Table for KeyAquired events */}
      {/* Implement the table for KeyAquired events as you already have */}
    </div>
  );
};

export default User;
