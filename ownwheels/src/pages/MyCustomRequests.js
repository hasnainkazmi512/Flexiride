import React, { useState, useEffect } from 'react';
import styles from '../styles/MyCustomRequests.module.css';

const MyCustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('Please login to view requests');
  
      const response = await fetch('/api/custom-requests', {
        headers: {
          'auth-token': token
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch requests');
      }
  
      setRequests(data.requests || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (requestId, bidId) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) throw new Error('Please login to perform this action');

      const response = await fetch('/api/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ requestId, bidId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept bid');
      }

      setSuccessMessage('Bid accepted successfully!');
      // Refresh the requests list
      await fetchMyRequests();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error accepting bid:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  if (loading) return <div className={styles.loading}>Loading your requests...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Your Custom Requests</h2>
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      
      {requests.length === 0 ? (
        <p>No custom requests found</p>
      ) : (
        <div className={styles.requestsList}>
          {requests.map(request => (
            <div key={request._id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <h3>PKR {request.budget}</h3>
                <p>Status: <span className={
                  request.status === 'open' ? styles.statusOpen : 
                  request.status === 'accepted' ? styles.statusAccepted : 
                  styles.statusClosed
                }>
                  {request.status.toUpperCase()}
                </span></p>
              </div>
              <p>{request.description}</p>
              {request.location && <p>Location: {request.location}</p>}

              <h4>Bids ({request.bids?.length || 0})</h4>
              {request.bids?.length > 0 ? (
                <div className={styles.bidsContainer}>
                  {request.bids.map(bid => (
                    <div key={bid._id} className={`${styles.bidCard} ${
                      bid.status === 'accepted' ? styles.acceptedBid :
                      bid.status === 'rejected' ? styles.rejectedBid : ''
                    }`}>
                      <div className={styles.bidHeader}>
                        <p>From: <strong>{bid.provider?.name || 'Unknown'}</strong></p>
                        <p>Amount: <strong>PKR {bid.amount}</strong></p>
                        <p>Status: {bid.status || 'pending'}</p>
                      </div>
                      {bid.carDetails && <p>Car: {bid.carDetails}</p>}
                      {bid.message && <p>Message: {bid.message}</p>}
                      
                      {request.status === 'open' && (
                        <button
                          onClick={() => handleAcceptBid(request._id, bid._id)}
                          className={styles.acceptButton}
                          disabled={bid.status === 'accepted' || bid.status === 'rejected'}
                        >
                          {bid.status === 'accepted' ? 'Accepted' : 'Accept Bid'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No bids received yet</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCustomRequests;