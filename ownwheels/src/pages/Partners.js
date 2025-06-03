// components/Partners.js
import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import styles from '../styles/Partners.module.css'; // Use CSS Modules

const Partners = () => {
  return (
    <div className={styles.partnersSection} id="partners">
      <Image 
        src="/images/colab.jpg" // Path from the public directory
        alt="Partners" 
        className={styles.partnersImage} 
        width={600} // Set a width that suits your design
        height={400} // Set a height that suits your design
        objectFit="cover" // Maintain aspect ratio
      />
      <div className={styles.partnersContent}>
      <h2>Collaboration with Our Partners</h2>
        <p>
          At FlexiRide, we are proud to collaborate with esteemed partners across the twin cities of Islamabad and Rawalpindi, ensuring seamless, luxurious, and secure travel experiences. Your journey, our priority. Through partnerships with top hotels, event organizers, and hospitality services, we provide tailored solutions such as luxury convoys, VIP protocol services, and self-drive rentals, catering to both business and leisure travelers. Driven by excellence, tailored for you.

          We also partner with corporate offices and real estate agencies, offering reliable and comfortable services for the business community. These collaborations reflect our shared commitment to excellence and customer satisfaction. Where reliability meets luxury. As we continue to grow, FlexiRide remains dedicated to delivering the best transportation experience in the twin cities, combining convenience, luxury, and reliability. FlexiRide — Where your journey begins with trust.
        </p>
      </div>
    </div>
  );
};

export default Partners;
