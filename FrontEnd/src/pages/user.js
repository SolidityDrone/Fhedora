import React, { useState, useEffect } from 'react';
import { contract } from '../App.js';
import ProcessSealArray from '../ProcessSealArray.js';
import { Button, Col, Form, Row, Table, Container, InputGroup, FormControl } from 'react-bootstrap';
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
    <Container className='mt-3'>
      
          {/* Search bar */}
        
        
      <Row className='mt-3'>
        
    
        <Col>
          <Row>
            <Col>
              <div>
              <Form>
              <Form.Group>
  <InputGroup>
    <FormControl
      type="text"
      value={searchAddress}
      onChange={(e) => setSearchAddress(e.target.value)}
      placeholder="Enter creator address"
    />
    <Button variant="primary" onClick={handleSearch}>Search</Button>
  </InputGroup>
</Form.Group>

          </Form>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Creator</th>
                      <th>Token ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.length > 0 ? (
                      searchResults.map((event, index) => (
                        <tr key={index}>
                          <td>{event.args.creator}</td>
                          <td>{event.args.tokenId}</td>
                          <td>
                            <Button variant="primary" size="sm" onClick={() => handleMint(event.args.tokenId, event.args.etherPrice)}>Mint</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No events found for the provided address.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col>
              <div>
                <h2>Aquired Keys</h2>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Token ID</th>
                      <th>CID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userEvents.map((event, index) => (
                      <tr key={index}>
                        <td>{event.args.tokenId}</td>
                        <td>
                          <span title={event.args.CID} style={{ cursor: 'pointer' }}>
                            {`${event.args.CID.substring(0, 8)}...${event.args.CID.substring(event.args.CID.length - 4)}`}
                            <Button variant="primary" size="sm" onClick={() => goToIPFS(event.args.CID)}>Download</Button>
                          </span>
                        </td>
                        <td>
                          <Button variant="primary" size="sm" onClick={() => handleProcessSealArray(event.args.tokenId)}>Process Seal Array</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default User;
