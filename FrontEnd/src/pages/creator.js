import React, { useState, useEffect } from 'react';
import { ethers, formatUnits } from 'ethers';
import { Button, Col, Container, ListGroup, Row, Table } from 'react-bootstrap';
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
    <Container>
   
      <Row className='mt-3'>
        <Col md={3}>
          <Form />
        </Col>
        <Col md={8}>
          <div>
            <h2>Uploaded Contents</h2>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                
                  <th>Item Name</th>
                  <th>CID</th>
                  <th>Price (ETH)</th>
                  <th>Max Supply</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {userEvents.map((event, index) => (
                  <tr key={index}>
                  
                    <td>{event.args.name}</td>
                    <td>
                      <span title={event.args.CID} style={{ cursor: 'pointer' }}>
                        {`${event.args.CID.substring(0, 8)}...${event.args.CID.substring(event.args.CID.length - 4)}`}
                       
                      
                      </span>
                    </td>
                    <td>{formatUnits(event.args.etherPrice, 'ether')}</td>
                    <td>{event.args.maxSupply}</td>
                    <td>  <Button variant="primary" size="sm" onClick={() => goToIPFS(event.args.CID)} style={{ marginLeft: '5px' }}>Download</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Creator;
