import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Services.module.css';


const servicesList = [
  { 
    id: 1, 
    title: "Self-Drive Rentals / Rent with Driver", 
    description: "Choose from a wide range of vehicles and drive yourself or have a luxury ride with our drivers.", 
    image: "/images/imgremove.png",
    link: '/Main'
  },
  { 
    id: 2, 
    title: "Trips and Tourage", 
    description: "Highly maintained vehicles for comfortable trips and travel", 
    image: "/images/imgremove.png",
    link: '/TripFront'
  },
  { 
    id: 3, 
    title: "Wedding Packages", 
    description: "Customizable vehicle convoys for special events.", 
    image: "/images/imgremove.png",
    link: '/MarriagePage'
  },
  { 
    id: 4, 
    title: "Protocol Services", 
    description: "High-profile protocol and security services.", 
    image: "/images/imgremove.png",
    link: 'ProtocolFront'
  },
  { 
    id: 5, 
    title: "Custom Rent Request", 
    description: "Post your custom vehicle requirements and receive competitive bids", 
    image: "/images/imgremove.png",
    link: '/CustomRent'
  }
];

const Services = () => {
  return (
    <div className={styles.servicesSection} id="services">
      <h2>Services</h2>
      <div className={styles.servicesContainer}>
        {servicesList.map(service => (
          <div key={service.id} className={styles.serviceBox}>
            {service.link ? (
              <Link className={styles.Link} href={service.link}>
                <h3>{service.title}</h3>
                <Image
                  src={service.image}
                  alt={service.title}
                  className={styles.serviceImage}
                  width={300}
                  height={200}
                  layout="responsive"
                  objectFit="cover"
                />
                <p>{service.description}</p>
              </Link>
            ) : (
              <>
                <h3>{service.title}</h3>
                <Image
                  src={service.image}
                  alt={service.title}
                  className={styles.serviceImage}
                  width={300}
                  height={200}
                  layout="responsive"
                  objectFit="cover"
                />
                <p>{service.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
