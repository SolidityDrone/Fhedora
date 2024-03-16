import { useState } from 'react';
import { ethers, formatUnits } from 'ethers';
import { contract } from '../App.js';

const EventList = ({ events }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const goToIPFS = (cid) => {
    window.open(`https://ipfs.io/ipfs/${cid}`, '_blank');
  };

  return (
    <ul>
      {events.map((event, index) => (
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
  );
};

const User = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const allEvents = await contract.queryFilter('IdCreation');
      const results = allEvents.filter(event => event.args.creator.toLowerCase() === searchAddress.toLowerCase());

      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching user events:', error);
      // Handle error (e.g., display a message to the user)
    }
  };

  return (
    <div>
      <h1>User Page</h1>
      <input
        type="text"
        value={searchAddress}
        onChange={(e) => setSearchAddress(e.target.value)}
        placeholder="Enter creator address"
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        <h2>Search Results</h2>
        {searchResults.length > 0 ? (
          <EventList events={searchResults} />
        ) : (
          <p>No events found for the provided address.</p>
        )}
      </div>
    </div>
  );
};

export default User;
