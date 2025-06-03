// components/ConfirmationModal.js
import React from 'react';
import styles from '../styles/ConfirmationModal.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Confirm Deletion</h2>
                <p className={styles.modalMessage}>
                    Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className={styles.modalActions}>
                    <button className={`${styles.modalButton} ${styles.confirm}`} onClick={onConfirm}>
                        Yes, Delete
                    </button>
                    <button className={`${styles.modalButton} ${styles.cancel}`} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
