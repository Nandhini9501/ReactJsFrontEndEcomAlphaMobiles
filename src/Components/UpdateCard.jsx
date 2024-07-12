import  { useState } from 'react';
import axios from 'axios';

const UpdateCard = () => {
  // const [title, setTitle] = useState('');
  // const [price, setPrice] = useState('');
  const [reqDto, setReqDto] = useState('')
  const [image, setImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    // formData.append('title', title);
    // formData.append('price', price);
    formData.append('dto' , reqDto);
    formData.append('file', image);

    try {
      const response = await axios.post(`http://localhost:4000/registerApi/addCard`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Card created successfully', response.data);
    } catch (error) {
      console.error('There was an error creating the card!', error);
    }
  };

  return (
    <form >
      {/* <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Price :</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div> */}
      <div>
        <label>Title:</label>
        <input type="text" value={reqDto} onChange={(e) => setReqDto(e.target.value)} required />
      </div>
      <div>
        <label>Price :</label>
        <input type="text" value={reqDto} onChange={(e) => setReqDto(e.target.value)} required />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
      </div>
      <button type="submit" onClick={handleSubmit}>Create Card</button>
    </form>
    
  );
};

export default UpdateCard;
