import React, { useState, useEffect } from 'react';
import styles from '../styles/YourOfferedDeals.module.css'; // Import CSS module

const YourOfferedDeals = () => {
  const [dealsData, setDealsData] = useState({
    cars: [],
    marriage: [],
    protocol: [],
    trip: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDealsData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/viewDeals', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${localStorage.getItem('auth-token')}`,

          },
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data)
          setDealsData({
            cars: data.cars || [],
            marriage: data.marriage || [],
            protocol: data.protocol || [],
            trip: data.trip || [],
          });
        } else {
          setError('Failed to fetch deals');
        }
      } catch (error) {
        setError('Error fetching deals');
      } finally {
        setLoading(false);
      }
    };

    fetchDealsData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const renderDeals = (deals, category) => {
    return deals.length > 0 ? (
      deals.map((deal) => (
        <div className={styles.dealCard} key={deal._id}>
          <img src={deal.image || ''} alt={deal.name} className={styles.dealImage} />
          <h3 className={styles.dealName}>{deal.name}</h3>
          <p className={styles.dealDetails}><span className={styles.boldText}>Details:</span> {deal.details || 'N/A'}</p>
          <p className={styles.dealPrice}><span className={styles.boldText}>Price:</span> {deal.price || 'N/A'}</p>
          <div className={styles.actionButtons}>
            <button className={styles.viewDetailsBtn}>View Details</button>
            <button className={styles.editBtn}>Edit</button>
          </div>
        </div>
      ))
    ) : (
      <div>No {category} deals available</div>
    );
  };

  return (
    <div className={styles.dealsContainer}>
      <h1 className={styles.title}>Your Offered Deals</h1>
      <div>
        <h2 className={styles.subtitle}>Uploaded Cars</h2>
        <div className={styles.dealsGrid}>{renderDeals(dealsData.cars, 'car')}</div>
      </div>

      <div>
        <h2 className={styles.subtitle}>Marriage Deals</h2>
        <div className={styles.dealsGrid}>{renderDeals(dealsData.marriage, 'marriage')}</div>
      </div>

      <div>
        <h2 className={styles.subtitle}>Protocol Deals</h2>
        <div className={styles.dealsGrid}>{renderDeals(dealsData.protocol, 'protocol')}</div>
      </div>

      <div>
        <h2 className={styles.subtitle}>Trip Deals</h2>
        <div className={styles.dealsGrid}>{renderDeals(dealsData.trip, 'trip')}</div>
      </div>
    </div>
  );
};

export default YourOfferedDeals;
