// Frontend Component
import { useState } from 'react';
import styles from '../styles/upload-cars.module.css'; // Use CSS modules

const UploadCar = () => {
  const [carDetails, setCarDetails] = useState({
    name: '',
    price: '',
    model: '',
    reg: '',
    transmission: '',
    mileage: '',
    color: '',
  });

  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  // Handle input changes for car details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle image uploads (max 3 images)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      setError('You can only upload up to 3 images.');
      return;
    }
    const base64Images = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(base64Images)
      .then((results) => {
        setImages([...images, ...results]);
        setError(null);
      })
      .catch(() => {
        setError('Failed to upload images.');
      });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    const formattedImages = {
      img1: images[0] || null,
      img2: images[1] || null,
      img3: images[2] || null,
    };
    console.log(images[0])
    const payload = {
      car_name: carDetails.name,
      fare: carDetails.price,
      car_make: carDetails.model,
      reg_plate: carDetails.reg,
      transmission: carDetails.transmission,
      mileage: carDetails.mileage,
      Color: carDetails.color,
      images: formattedImages,
    };

    try {
      const response = await fetch('http://localhost:3000/api/uploadRent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
        },
        body: JSON.stringify(payload), // Send the customer data
      });

      setCarDetails({
        name: '',
        price: '',
        model: '',
        reg: '',
        transmission: '',
        mileage: '',
        color: '',
      });
      setImages([]);
      setError("Uploaded successfully!");
    } catch (err) {
      console.error(err);
      setError('Failed to upload car. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Upload Your Car for Rent</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>
            Car Name:
            <input
              type="text"
              name="name"
              value={carDetails.name}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </label>
          <label className={styles.label}>
            Price (RS/Day):
            <input
              type="number"
              name="price"
              value={carDetails.price}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </label>
        </div>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>
            Model:
            <input
              type="text"
              name="model"
              value={carDetails.model}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </label>
          <label className={styles.label}>
            Reg-Plate:
            <input
              type="text"
              name="reg"
              value={carDetails.reg}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </label>
        </div>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>
            Transmission:
            <select
              name="transmission"
              value={carDetails.transmission}
              onChange={handleInputChange}
              className={styles.selectField}
              required
            >
              <option value="">Select</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </label>
          <label className={styles.label}>
            Mileage:
            <input
              type="text"
              name="mileage"
              value={carDetails.mileage}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </label>
        </div>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>
            Color:
            <input
              type="text"
              name="color"
              value={carDetails.color}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </label>
          <label className={styles.label}>
            Upload Car Images (Max 3):
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
            />
          </label>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>

      {images.length > 0 && (
        <div className={styles.preview}>
          <h3>Image Preview:</h3>
          <div className={styles.imageGrid}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Car Image ${index + 1}`}
                className={styles.imagePreview}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCar;