import React, { useState } from "react";
import Image from "next/image";
import styles from "../styles/HotOffers.module.css";

const HotOffers = ({ offers = [] }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isRequested, setIsRequested] = useState(false);

  const handleCardClick = (offer) => {
    setSelectedOffer(offer);
    setIsRequested(false);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };

  const handleRequestClick = () => {
    setIsRequested(true);
  };

  return (
    <div className={styles.hotOffers}>
      <h2 className={styles.title}>Hot Offers</h2>
      <div className={styles.offersGrid}>
        {(Array.isArray(offers) ? offers : []).slice(0, 3).map((offer) => (
          <div
            className={styles.offerCard}
            key={offer?.id || offer?._id}
            onClick={() => handleCardClick(offer)}
          >
            <Image
              src={offer?.image || "/no-image.jpg"}
              alt={offer?.name || "Offer Image"}
              width={400}
              height={300}
              className={styles.image}
            />
            <h3>{offer?.name}</h3>
            <p>Price: {offer?.price}</p>
            <p>Quantity: {offer?.quantity}</p>
            <div className={styles.hotTag}>Hot</div>
          </div>
        ))}
      </div>

      {selectedOffer && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.close} onClick={handleCloseModal}>
              &times;
            </span>
            <Image
              src={selectedOffer?.image || "/no-image.jpg"}
              alt={selectedOffer?.name}
              width={600}
              height={400}
              className={styles.carImage}
            />
            <h2>{selectedOffer?.name}</h2>
            <p>Price: {selectedOffer?.price}</p>
            <p>Model: {selectedOffer?.model}</p>
            <p>Colour: {selectedOffer?.colour}</p>
            <p>Transmission: {selectedOffer?.transmission}</p>
            <p>Mileage: {selectedOffer?.mileage}</p>
            <p>{selectedOffer?.details || "No details available"}</p>
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

export default HotOffers;
