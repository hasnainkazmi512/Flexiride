  import React from 'react';
  import styles from '../styles/AboutUs.module.css'; // Use the CSS module correctly
  import Image from 'next/image'; // Next.js Image component

  // Import polaroid images
  import image1 from '../../public/images/photo1.jpg';
  import image2 from '../../public/images/photo2.jpg';
  import image3 from '../../public/images/photo3.jpg';
  import image4 from '../../public/images/photo4.jpg';
  import image6 from '../../public/images/photo6.jpg';

  const polaroidImages = [
    { src: image1, caption: 'Polaroid 1' },
    { src: image2, caption: 'Polaroid 2' },
    { src: image3, caption: 'Polaroid 3' },
    { src: image4, caption: 'Polaroid 4' },
    { src: image6, caption: 'Polaroid 6' }
  ];

  const AboutUs = () => {
    return (
      <div className={styles.aboutussection} id="about-us"> {/* Use CSS modules */}
        <div className={styles.aboutUsContent}>
          <h2 className={styles.aboutUsHeading}>About Us</h2>
          <p className={styles.aboutUsText}>
            <span className={styles.highlightText}>FlexiRide</span> is dedicated to providing a wide range of vehicle rental options for every need. Whether you’re looking 
            for a self-drive rental, a driver-driven car, or special wedding and protocol services, we are here to deliver an 
            exceptional experience. Our goal is to provide <strong>convenience, reliability, and flexibility</strong> in your travel.
          </p>
        </div>
        
        <div className={styles.polaroidGallery}>
          {polaroidImages.map((image, index) => (
            <div key={index} className={styles.polaroid}>
              {/* Use Next.js Image for better performance */}
              <Image 
                src={image.src} 
                alt={image.caption} 
                className={styles.polaroidImg} 
                width={300} // Set your desired width
                height={400} // Set your desired height
                layout="responsive" 
              />
              <p className={styles.polaroidCaption}>{image.caption}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default AboutUs;
