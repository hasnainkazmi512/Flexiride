import React, { useState, useEffect } from 'react';
import styles from '../styles/CustomRequests.module.css';

const CustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [carDetails, setCarDetails] = useState('');

  useEffect(() => {
    const fetchOpenRequests = async () => {
      try {
        const response = await fetch('/api/open', {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        });
        const data = await response.json();
        if (response.ok) {
          setRequests(data.requests);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenRequests();
  }, []);

  const handleSubmitBid = async (requestId) => {
    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token')
        },
        body: JSON.stringify({
          requestId,
          amount: bidAmount,
          message: bidMessage,
          carDetails
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Bid submitted successfully!');
        setSelectedRequest(null);
        setBidAmount('');
        setBidMessage('');
        setCarDetails('');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2>Available Custom Requests</h2>
      
      {requests.length === 0 ? (
        <p>No open custom requests available.</p>
      ) : (
        <div className={styles.requestsList}>
          {requests.map(request => (
            <div key={request._id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <h3>Budget: PKR {request.budget}</h3>
                <p>Posted by: {request.user?.name || 'Anonymous'}</p>
              </div>
              <p>{request.description}</p>
              <p>Location: {request.location}</p>
              <p>Preferred Dates: {request.preferredDates?.join(', ') || 'Flexible'}</p>
              
              <button 
                onClick={() => setSelectedRequest(request._id)}
                className={styles.bidButton}
              >
                Place Bid
              </button>

              {selectedRequest === request._id && (
                <div className={styles.bidForm}>
                  <h4>Submit Your Bid</h4>
                  <div className={styles.formGroup}>
                    <label>Your Offer (PKR)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter your price"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Message to Customer</label>
                    <textarea
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      placeholder="Any special terms or messages"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Car Details</label>
                    <textarea
                      value={carDetails}
                      onChange={(e) => setCarDetails(e.target.value)}
                      placeholder="Describe the vehicle you're offering"
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button 
                      onClick={() => handleSubmitBid(request._id)}
                      className={styles.submitButton}
                    >
                      Submit Bid
                    </button>
                    <button 
                      onClick={() => setSelectedRequest(null)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRequests;