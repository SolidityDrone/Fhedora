import logo from './hat.png';
import './App.css';
import { FhenixClient, getPermit, EncryptedType, EncryptionTypes, EncryptedUint32 } from 'fhenixjs';
import { getAddress, BrowserProvider, ethers, utils } from 'ethers';
import { Connect } from './Connect';
import FileUpload from './zcrypt';
import ProcessSealArray from './unseal';
import contractAbi from './FHEcontractABI.json';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Creator from '../src/pages/creator.js'; // Import Creator component
import User from '../src/pages/user.js'; // Import User component

export const provider = new BrowserProvider(window.ethereum);
export const client = new FhenixClient({ provider });

export const contractAddress = getAddress("0x038a57DECf031Fb8D0BaDda6FBec063eED9bd225");
let permit;
permit = await getPermit(contractAddress, provider);
client.storePermit(permit);

export const permission = client.extractPermitPermission(permit);

const signer = await provider.getSigner();

export const contract = new ethers.Contract(contractAddress, contractAbi, signer);
try {
  
  ProcessSealArray()
} catch {
  //
}


function Navbar() {
  return (
    <nav className="navbar">
    <div className="navbar-container">
      {/* Logo */}
      <ul className="navbar-links">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" width="22" height="22" />
        </div>
        {/* Links */}
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/creator" className="navbar-link">Creator</Link>
        </li>
        <li className="navbar-item">
          <Link to="/user" className="navbar-link">User</Link>
        </li>
      </ul>
      {/* Connect Component */}
      <div className="navbar-right">
        <Connect>{(account, provider) => <></>}</Connect>
      </div>
    </div>
  </nav>
  
  );
}

function App() {
  return (
    <Router>
       <Navbar />
      
        <Switch>
          {/* Define routes for Creator and User */}
          <Route path="/creator">
            <Creator />
          </Route>
          <Route path="/user">
            <User />
          </Route>
        </Switch>
      
    </Router>
  );
}

export default App;
