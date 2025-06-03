// UserCars Component
import React, { useState, useEffect } from 'react';
import styles from '../styles/your-cars.module.css'; // Import CSS module
import UploadCars from './upload-cars'; // Import the UploadCars component
import UploadMarriageCar from './marriageUpload';
import UploadProtocolCars from './UploadProtocolCars'; // Ensure the filename and path are correct
import UploadTripCars from './UploadTripCars';
import YourOfferedDeals from './YourOfferedDeals'; // Import the YourOfferedDeals component

const UserCars = () => {
  const [carsdata, setCarsData] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUpload, setCurrentUpload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(localStorage.getItem('auth-token'))
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/viewRentAd', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${localStorage.getItem('auth-token')}`,
            'options': 'user',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCarsData(data.ads || []);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const openCarDetails = (car) => {
    setSelectedCar(car);
  };

  const openEditModal = (car) => {
    setSelectedCar(car);
    setIsEditing(true);
  };

  const closeModal = () => {
    setSelectedCar(null);
    setIsEditing(false);
  };

  const handleEditSubmit = async (updatedCar) => {
    try {
      const response = await fetch('http://localhost:3000/api/updateDelRent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'user-type': '0',
        },
        body: JSON.stringify({
          rentId: updatedCar._id,
          ...updatedCar,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCarsData(carsdata.map(car => (car._id === updatedCar._id ? updatedCar : car)));
        closeModal();
      } else {
        setError(data.error || 'Failed to update car');
      }
    } catch (error) {
      setError('Error updating car');
    }
  };
  
  const handleUploadClick = () => setCurrentUpload('car');
  const handleUploadMarriageClick = () => setCurrentUpload('marriage');
  const handleUploadProtocolClick = () => setCurrentUpload('protocol');
  const handleUploadTripClick = () => setCurrentUpload('trip');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.carListContainer}>
      {currentUpload === null && (
        <>
          <h1>Your Uploaded Cars</h1>
          <div style={{ display: 'flex' }}>
            <button className={styles.uploadVehicleBtn} onClick={handleUploadClick}>Upload a Vehicle</button>
            <button className={styles.uploadVehicleBtn} onClick={handleUploadMarriageClick}>Upload a Marriage Deal</button>
            <button className={styles.uploadVehicleBtn} onClick={handleUploadProtocolClick}>Upload a Protocol Deal</button>
            <button className={styles.uploadVehicleBtn} onClick={handleUploadTripClick}>Upload a Trip Deal</button>
          </div>

          <div className={styles.carsGrid}>
            {carsdata.length > 0 ? (
              carsdata.map((car) => (
                <div className={styles.carCard} key={car._id}>
                  <img src={car.images[0].img1} alt={car.car_name} className={styles.carImage} />
                  <h3>{car.name}</h3>
                  <p><strong>Car No:</strong> {car.reg_plate}</p>
                  <p><strong>Price:</strong> {car.fare}</p>
                  <p><strong>Model:</strong> {car.car_make}</p>
                  <p><strong>Transmission:</strong> {car.transmission}</p>
                  <p><strong>Mileage:</strong> {car.mileage}</p>
                  <p><strong>Color:</strong> {car.Color}</p>
                  <div className={styles.actionButtons}>
                    <button className={styles.viewDetailsBtn} onClick={() => openCarDetails(car)}>View Details</button>
                    <button className={styles.editBtn} onClick={() => openEditModal(car)}>Edit</button>
                  </div>
                </div>
              ))
            ) : (
              <div>No cars available</div>
            )}
          </div>

          {selectedCar && isEditing && (
            <EditCarModal car={selectedCar} onClose={closeModal} onSubmit={handleEditSubmit} />
          )}

          {selectedCar && !isEditing && <CarDetailsModal car={selectedCar} onClose={closeModal} />}
        </>
      )}

      {currentUpload === 'car' && <UploadCars onBack={() => setCurrentUpload(null)} />}
      {currentUpload === 'marriage' && <UploadMarriageCar onBack={() => setCurrentUpload(null)} />}
      {currentUpload === 'protocol' && <UploadProtocolCars onBack={() => setCurrentUpload(null)} />}
      {currentUpload === 'trip' && <UploadTripCars onBack={() => setCurrentUpload(null)} />}

      {/* Display the YourOfferedDeals component here */}
      {/* <YourOfferedDeals /> */}
    </div>
  );
};


const CarDetailsModal = ({ car, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        <h2>{car.name}</h2>
        <img src={car.images[0].img1} alt={car.car_name} className={styles.modalCarImage} />
        <p><strong>Price (RS/Day):</strong> {car.fare}</p>
        <p><strong>Model:</strong> {car.car_name}</p>
        <p><strong>Reg-Plate:</strong> {car.regPlate}</p>
        <p><strong>Transmission:</strong> {car.transmission}</p>
        <p><strong>Mileage:</strong> {car.mileage}</p>
        <p><strong>Color:</strong> {car.Color}</p>
      </div>
    </div>
  );
};

const EditCarModal = ({ car, onClose, onSubmit }) => {
  const [updatedCar, setUpdatedCar] = useState(car);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCar({ ...updatedCar, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(updatedCar);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        <h2>Edit Car Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Car Name:
            <input type="text" name="name" value={updatedCar.car_name} onChange={handleChange} />
          </label>
          <br/>
          <label>
            Price (RS/Day):
            <input type="text" name="price" value={updatedCar.fare} onChange={handleChange} />
          </label>
          <br/>
          <label>
            Model:
            <input type="text" name="model" value={updatedCar.car_name} onChange={handleChange} />
          </label>
          <br/>
          <label>
            Reg-Plate:
            <input type="text" name="regPlate" value={updatedCar.reg_plate} onChange={handleChange} />
          </label>
          <br/>
          <label>
            Transmission:
            <input type="text" name="transmission" value={updatedCar.transmission} onChange={handleChange} />
          </label>
          <br/>
          <label>
            Mileage:
            <input type="text" name="mileage" value={updatedCar.mileage} onChange={handleChange} />
          </label>
          <br/>
          <label>
            Color:   
            <input type="text" name="color" value={updatedCar.Color} onChange={handleChange} />
          </label>
          <br/>
          <button type="submit" className={styles.submitBtn}>Save Changes</button>
        </form>
      </div>
    </div>
  );
};
export default UserCars;
