import React, { useState } from 'react';
import FileUpload from '../zcrypt';
import { Button } from 'react-bootstrap';
const Form = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [maxSupply, setMaxSupply] = useState('');
  const [file, setFile] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleMaxSupplyChange = (e) => {
    setMaxSupply(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if all fields are filled
    if (!name || !description || !price || !maxSupply || !file) {
      alert('All fields are required.');
      return;
    }
    // Send form data to backend or perform further actions
    console.log({
      name,
      description,
      price,
      maxSupply,
      file
    });
    // Reset form fields
    setName('');
    setDescription('');
    setPrice('');
    setMaxSupply('');
    setFile(null);
  };

  return (
    <div>
      <h2>Upload Form</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input type="text" id="description" value={description} onChange={handleDescriptionChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input type="number" id="price" value={price} onChange={handlePriceChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="maxSupply">Max Supply:</label>
        <input type="number" id="maxSupply" value={maxSupply} onChange={handleMaxSupplyChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="file">Upload File:</label>
        <input type="file" id="file" className="file-input" onChange={handleFileChange} required />
        <label htmlFor="file" className="file-upload-button">Choose File</label>
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
      {file && (
        <FileUpload
          file={file}
          name={name}
          description={description}
          price={price}
          maxSupply={maxSupply}
        />
      )}
    </div>
  );
};

export default Form;
