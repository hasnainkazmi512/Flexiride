import React, { useState } from "react";
import styles from "../styles/AllOffers.module.css";

const AllOffers = ({ filteredOffers = [], setSearchTerm }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [error, setError] = useState(null);

  const handleCardClick = (offer) => {
    setSelectedOffer(offer);
    setIsRequested(false);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };

  const handleRequestClick = async () => {
    try {
      const response = await fetch('/api/MakeOrderFront', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token')
        },
        body: JSON.stringify({
          productID: selectedOffer._id,
          type: 2
        })
      });

      const data = await response.json();
      if (response.ok) {
        setIsRequested(true);
      } else {
        setError('Failed to submit request');
      }
    } catch (error) {
      setError('Error submitting request');
    }
  };

  return (
    <div className={styles.allOffers}>
      <h2>All Trips</h2>

      {Array.isArray(filteredOffers) && filteredOffers.length > 0 ? (
        <div className={styles.offersGrid}>
          {filteredOffers.map((offer) => (
            <div
              className={styles.offerCard}
              key={offer._id}
              onClick={() => handleCardClick(offer)}
            >
              <img
                src={offer.images?.[0]?.img1 || "/images/default.jpg"}
                alt={offer.title || "Image"}
                className={styles.carImage}
              />
              <h3
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm(offer.title);
                }}
                className={styles.clickableName}
              >
                {offer.title}
              </h3>
              <p>Price: {offer.price}</p>
              <p>Description: {offer.desc}</p>
              {offer.isHot && <div className={styles.hotTag}>Hot</div>}
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
              src={selectedOffer.images?.[0]?.img1 || "/images/default.jpg"}
              alt={selectedOffer.title}
              className={styles.carImage}
            />
            <h2>{selectedOffer.title}</h2>
            <p>Price: {selectedOffer.price}</p>
            <p>Description: {selectedOffer.desc}</p>
            <p>Special Instruction: {selectedOffer.special_instruction}</p>
            <p>{selectedOffer.details || "No details available"}</p>
            <button
              className={`${styles.requestButton} ${
                isRequested ? styles.requested : ""
              }`}
              onClick={handleRequestClick}
              disabled={isRequested}
            >
              {isRequested ? "Requested" : "Request"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOffers;
