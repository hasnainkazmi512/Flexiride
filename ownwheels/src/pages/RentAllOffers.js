"use client";

import React, { useState } from "react";
import styles from "../styles/RentAllOffers.module.css";

const RentAllOffers = ({ filteredOffers, setSearchTerm }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  
  const handleCardClick = (offer) => {
    setSelectedOffer(offer);
    setIsRequested(false);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };

  const handleRequestClick = async () => {
    console.log("Selected Offer Details:", selectedOffer);
    
    try {
      // Fetch user data from the API
      if(localStorage.getItem('auth-token'))
      {

        const response = await fetch('http://localhost:3000/api/MakeOrderFront', {
          method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
        },
        body: JSON.stringify({
          productID: selectedOffer._id,
          type:1
        })
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setIsRequested(data)
      } else {
        console.log("error fetching data")
      }
    }
    else{
      alert("Please Login First");
    }
    } catch (error) {
      console.log("error fetching data")
    } finally {
    }
  };
  console.log(filteredOffers)
  return (
    <div className={styles.rentAllOffers}>
      <h2 className={styles.title}>Available Vehicles</h2>
      {filteredOffers.length > 0 ? (
        <div className={styles.offersGrid}>
          {filteredOffers.map((offer) => (
            <div
              className={styles.offerCard}
              key={offer._id}
              onClick={() => handleCardClick(offer)}
            >
              <img
                src={offer.images[0].img1}
                alt="not found"
                className={styles.carImage}
              />
              <h3
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm(offer.car_name);
                }}
                className={styles.clickableName}
              >
                {offer.car_name}
              </h3>
              <p>Price: {offer.fare}</p>
              
              {offer.driver_status && (
                <div className={styles.driverTag}>With Driver</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No offers available</p>
      )}

      {selectedOffer && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.close} onClick={handleCloseModal}>
              &times;
            </span>
            <img
              src={selectedOffer.images[0].img1}
              alt={selectedOffer.car_name}
              className={styles.carImage}
            />
            <h2>{selectedOffer.car_name}</h2>
            <p>Price: {selectedOffer.fare}</p>
            <p>Model: {selectedOffer.car_make}</p>
            <p>Colour: {selectedOffer.Color}</p>
            <p>Transmission: {selectedOffer.transmission}</p>
            <p>Mileage: {selectedOffer.mileage}</p>
            <button
              className={`${styles.requestButton} ${
                isRequested ? styles.requested : ""
              }`}
              onClick={handleRequestClick}
            >
              {isRequested ? "Requested" : "Request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentAllOffers;
