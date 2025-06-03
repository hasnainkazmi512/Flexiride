// src/components/Alert.js
import React from 'react';
import styles from '../styles/Alert.module.css'; // Import CSS module

const AlertModal = ({ message, onClose }) => {
  return (
    <div className={styles.alertModal}>
      <div className={styles.alertModalContent}>
        <h2>Alert!</h2>
        <p>{message}</p>
        <button className={styles.alertCloseBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
