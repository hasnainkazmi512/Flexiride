import React from 'react';
import styles from '../styles/Footer.module.css'; // Importing CSS module

const Footer = () => {
  return (
    <footer className={styles.footersection}>
      <p>&copy; 2024 FlexiRide. All Rights Reserved.</p>
      <div className={styles.footerlinks}>
        <a href="#services">Services</a>
        <a href="#about-us">About Us</a>
        <a href="#partners">Partners</a>
      </div>
    </footer>
  );
};

export default Footer;
