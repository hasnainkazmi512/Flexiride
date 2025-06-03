import {React,useState} from "react";
import styles from "../styles/HotOffers.module.css";

const HotOffers = ({ offers }) => {
  const [selectedOffer, setSelectedOffer] = useState(null); // To track the selected offer
  const [isRequested, setIsRequested] = useState(false); // To track if the request button is clicked

  const handleCardClick = (offer) => {
    setSelectedOffer(offer); // Set the selected offer for the modal
    setIsRequested(false); // Reset the request button state when a new offer is clicked
  };

  const handleCloseModal = () => {
    setSelectedOffer(null); // Close the modal
  };

  const handleRequestClick = () => {
    setIsRequested(true); // Change button state to requested
  };

  return (
    <div className={styles.hotOffers}>
      <h2 className={styles.title}>Hot Offers</h2>
      <div className={styles.offersGrid}>
        {offers.slice(0, 3).map((offer) => (
          <div
            className={styles.offerCard}
            key={offer.id}
            onClick={() => handleCardClick(offer)}
          >
            <img src={offer.image} alt={offer.name} className={styles.image} />
            <h3>{offer.name}</h3>
            <p>Price: {offer.price}</p>
            <p>Quantity: {offer.quantity}</p>
            <div className={styles.hotTag}>Hot</div>
          </div>
        ))}
      </div>

      {/* Modal for viewing vehicle details */}
      {selectedOffer && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <span className={styles.close} onClick={handleCloseModal}>
              &times;
            </span>
            <img
              src={selectedOffer.image}
              alt={selectedOffer.name}
              className={styles.carImage}
            />
            <h2>{selectedOffer.name}</h2>
            <p>Price: {selectedOffer.price}</p>
            <p>Model: {selectedOffer.model}</p>
            <p>Colour: {selectedOffer.colour}</p>
            <p>Transmission: {selectedOffer.transmission}</p>
            <p>Mileage: {selectedOffer.mileage}</p>
            <p>{selectedOffer.details || "No details available"}</p>
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
