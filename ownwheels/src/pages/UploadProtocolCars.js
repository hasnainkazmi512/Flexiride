import { useState } from 'react';
import styles from '../styles/upload-cars.module.css'; // Use CSS modules

const UploadProtocolCars = () => {
  const [carDetails, setCarDetails] = useState({
    title: '',
    desc: '',
    driver: '',
    special_instruction: '',
    price: '',
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

    const payload = {
      ...carDetails,
      images: formattedImages,
      type_deal:"protocol"
    };
    console.log(payload)
    try {
      const response = await fetch('http://localhost:3000/api/makedeals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
        },
        body: JSON.stringify(payload),
      });

      setCarDetails({
        title: '',
        desc: '',
        driver: '',
        special_instruction: '',
        price: '',
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
            Title:
            <input
              type="text"
              name="title"
              value={carDetails.title}
              onChange={handleInputChange}
              className={styles.inputField}
              required
            />
          </label>
          <label className={styles.label}>
            Description:
            <textarea
              name="desc"
              value={carDetails.desc}
              onChange={handleInputChange}
              className={styles.textareaField}
              required
            />
          </label>
        </div>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>
            Driver Availability:
            <select
              name="driver"
              value={carDetails.driver}
              onChange={handleInputChange}
              className={styles.selectField}
              required
            >
              <option value="">Select</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
          </label>
          <label className={styles.label}>
            Special Instructions:
            <textarea
              name="special_instruction"
              value={carDetails.special_instruction}
              onChange={handleInputChange}
              className={styles.textareaField}
              required
            />
          </label>
        </div>
        <div className={styles.fieldContainer}>
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

export default UploadProtocolCars;
