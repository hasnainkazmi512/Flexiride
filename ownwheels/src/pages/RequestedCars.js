"use client";
import React, { useState, useEffect } from 'react';
import styles from '../styles/RequestedCars.module.css';

const RequestedCars = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/custom-request', {
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

    fetchRequests();
  }, []);

  const handleAcceptBid = async (requestId, bidId) => {
    try {
      const response = await fetch('/api/bids', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token')
        },
        body: JSON.stringify({
          requestId,
          bidId,
          action: 'accept'
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setRequests(requests.map(req => 
          req._id === requestId ? data.request : req
        ));
      }
    } catch (error) {
      console.error('Error accepting bid:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2>Your Custom Requests</h2>
      {requests.length === 0 ? (
        <p>No custom requests found.</p>
      ) : (
        requests.map(request => (
          <div key={request._id} className={styles.requestCard}>
            <div className={styles.requestHeader}>
              <h3>Budget: PKR {request.budget}</h3>
              <p>Status: {request.status}</p>
            </div>
            <p>{request.description}</p>
            <div className={styles.bidsSection}>
              <h4>Bids Received ({request.bids.length})</h4>
              {request.bids.length > 0 ? (
                request.bids.map(bid => (
                  <div key={bid._id} className={styles.bidCard}>
                    <div className={styles.bidHeader}>
                      <span>Provider: {bid.provider?.name || 'Unknown'}</span>
                      <span>PKR {bid.amount}</span>
                      <span>Status: {bid.status}</span>
                    </div>
                    <p>{bid.message}</p>
                    <p>Car Details: {bid.carDetails}</p>
                    {request.status === 'open' && (
                      <button 
                        onClick={() => handleAcceptBid(request._id, bid._id)}
                        disabled={bid.status === 'rejected'}
                      >
                        {bid.status === 'accepted' ? 'Accepted' : 'Accept Bid'}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No bids received yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RequestedCars;