// components/Hero.js
import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Hero.module.css'; // Adjust the path as necessary

const Hero = () => {
  const router = useRouter();

  const handleRentNowClick = () => {
    router.push('/Main'); // Redirect to the allcars page
  };

  return (
    <div className={styles.herosection}>
      <div className={styles.heromedia}>
        {/* Use the video from the public folder */}
        <video 
          className={styles.herovideo} 
          src="/images/video.mp4" // Path from the public directory
          autoPlay 
          loop 
          muted 
          playsInline // Ensures it plays inline on mobile
        />
      </div>
      <div className={styles.herocontent}>
        <h1>Explore the Best Car Rental Services with FlexiRide</h1>
        <p>Your journey starts here. Rent your car now!</p>
        <button className={styles.rentbtn} onClick={handleRentNowClick}>
          Rent Now
        </button>
      </div>
    </div>
  );
};

export default Hero;
