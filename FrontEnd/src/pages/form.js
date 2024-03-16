import React, { useState } from 'react';
import FileUpload from '../zcrypt';

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
      <h1>Upload Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={handleDescriptionChange} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={price} onChange={handlePriceChange} required />
        </div>
        <div>
          <label>Max Supply:</label>
          <input type="number" value={maxSupply} onChange={handleMaxSupplyChange} required />
        </div>
        <div>
          <label>Upload File:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <button type="submit">Submit</button>
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
