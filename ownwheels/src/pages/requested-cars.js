import React, { useState, useEffect } from 'react';
import styles from '../styles/requested-cars.module.css'; // Importing CSS module

// Date formatting function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const App = () => {
  const [requestedCars, setRequestedCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [carToCancel, setCarToCancel] = useState(null);

  // Fetch the requested cars/orders on component mount
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ViewOrders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
          },
        });

        const data = await response.json();

        if (response.ok) {
          setRequestedCars(data.products);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserOrders();
  }, []);
console.log(requestedCars)
  const handleCancelRequest = (carId) => {
    setRequestedCars(requestedCars.filter(car => car.order._id !== carId));
    setSelectedCar(null);
    setShowConfirmModal(false);
  };

  const openCancelModal = (carId) => {
    setCarToCancel(carId);
    setShowConfirmModal(true);
  };

  const updateCarDates = (carId, updatedStartDate, updatedEndDate) => {
    const updatedCars = requestedCars.map((car) =>
      car.order._id === carId ? { ...car, startDate: updatedStartDate, endDate: updatedEndDate } : car
    );
    setRequestedCars(updatedCars);
  };

  return (
    <div id="box">
      <h1 style={{ color:"white",paddingLeft: '50px', paddingTop: '15px' }}>Requested Cars</h1>
      <RequestedCars
        requestedCars={requestedCars}
        onSelectCar={(car) => setSelectedCar(car)}
        onCancelRequest={openCancelModal}
      />
      {selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onUpdateDates={updateCarDates}
        />
      )}
      {showConfirmModal && (
        <ConfirmCancelModal
          onConfirm={() => handleCancelRequest(carToCancel)}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

const RequestedCars = ({ requestedCars, onSelectCar}) => {
  const onCancelRequest = async (orderID) => {
    const authHeader = localStorage.getItem("auth-token"); // Assuming token is stored in localStorage
    try {
      const response = await fetch('http://localhost:3000/api/UpdateOrder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authHeader,
          'user-type': '0', // Send user type as a header
        },
        body: JSON.stringify({ 
          orderID, 
          order_type: 4 // Set order_type to 2 for cancellation
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Successfully updated the order type
        alert('Order canceled successfully.');
        // Optionally, remove the order from the state or refetch the order list
      } else {
        // Handle error response
        alert(result.message || 'Failed to cancel the order');
      }
    } catch (error) {
      console.error('Error canceling the order:', error);
      alert('Error canceling the order');
    }
  };
  
  
  return (
    <div className={styles.carsContainer}>
      {requestedCars.length > 0 ? (
        requestedCars.map((car) => (
          <div key={car.order._id} className={styles.carCard}>
            <img src={car.product.images[0].img1} alt={car.product.car_name} className={styles.carImage} />
            <h3>{car.product.car_name|| car.product.title}</h3>
            <p>{car.product.fare || car.product.price}</p>
            <p>{car.product.car_make?"Model: ":"Package Type: "}{car.product.car_make || car.product.type_deal}</p>
            <p>{car.product.transmission}</p>
            <p>{car.product.mileage}</p>
            <p><b>Order No: {`${car.order._id.toString().padStart(5, '0')}`}</b></p>
            <button className={styles.detailsBtn} onClick={() => onSelectCar(car)}>Details</button>
            <button className={styles.cancelBtn} onClick={() => onCancelRequest(car.order._id)}>Cancel Request</button>
          </div>
        ))
      ) : (
        <p style={{color:"red"}}>No requested cars yet.</p>
      )}
    </div>
  );
};

const CarDetailsModal = ({ car, onClose, onUpdateDates }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(car.startDate);
  const [endDate, setEndDate] = useState(car.endDate);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.product.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + car.product.images.length) % car.product.images.length);
  };

  const handleSaveDates = () => {
    onUpdateDates(car.order._id, startDate, endDate); // Update the dates
    onClose(); // Close modal
  };
  console.log(car.order.StartDate)
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        <h2>{car.product.car_name || car.product.title}</h2>
        <div className={styles.imageContainer}>
          <button className={styles.prevBtn} onClick={handlePrevImage}>&lt;</button>
          <img src={car.product.images[0][`img${currentImageIndex + 1}`]} alt={car.product.car_name||car.product.title} className={styles.carImage} />
          <button className={styles.nextBtn} onClick={handleNextImage}>&gt;</button>
        </div>
        <p>Price: {car.product.fare || car.product.price}</p>
        <p>{car.product.car_make?"Model":"Package Type"}{car.product.car_make || car.product.type_deal}</p>
        <p>{car.product.transmission?"transmission":"Special Instruction"}{car.product.transmission || car.product.special_instruction}</p>
        <p>{car.product.mileage?"Mileage":"Driver Status"}{car.product.mileage || car.product.driver == true? "With Driver":"without Driver" }</p>
        <div className={styles.dateContainer}>
          <label>
            
            Start Date:
            <input type="date" value={new Date(car.order.StartDate).toISOString().substring(0, 10)}  onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <button className={styles.rewriteBtn} onClick={() => setStartDate(new Date().toISOString().substring(0, 10))}>
            Rewrite
          </button>
        </div>
        <div className={styles.dateContainer}>
          <label>
            End Date:
            <input type="date" value={new Date(car.order.EndDate).toISOString().substring(0, 10)}  onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <button className={styles.rewriteBtn} onClick={() => setEndDate(new Date().toISOString().substring(0, 10))}>
            Rewrite
          </button>
        </div>
        <div className={styles.carModalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSaveDates}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const ConfirmCancelModal = ({ onConfirm, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.closeModal} onClick={onClose}>&times;</span>
        <h2>Are you sure?</h2>
        <p>Do you want to cancel the request for this car?</p>
        <div className={styles.modalActions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>Yes, Cancel</button>
          <button className={styles.cancelBtn} onClick={onClose}>No, Keep</button>
        </div>
      </div>
    </div>
  );
};

export default App;
