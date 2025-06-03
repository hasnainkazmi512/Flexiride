import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/orderrequests.module.css';
import ChatArea from './chatArea';

const OrderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatCustomer, setChatCustomer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('auth-token'); // Retrieve token from localStorage
        const response = await fetch('http://localhost:3000/api/orderReq', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        if (!response.ok) {
          console.log("error")
        }

        const data = await response.json();
        const { orders, rents } = data.data;

        // Normalize and combine the orders and rents data
        const combinedData = orders.map((order) => {
          const rentDetails = rents.find((rent) => rent._id === order.productID);
          return {
            ...order,
            car_name: rentDetails?.car_name || 'Unknown Car',
            reg_plate: rentDetails?.reg_plate || 'N/A',
            images: rentDetails?.images || ['/default-image.jpg'], // Default image if missing
          };
        });
        console.log(combinedData)
        setRequests(combinedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Other functions like handleAccept, handleDeny, openModal, etc. remain the same.

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1 style={{ paddingLeft: '180px', paddingTop: '15px' }}>Order Requests</h1>
      <div className={styles.requestsContainer}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className={styles.requestCard}>
              <div className={`${styles.statusLabel} ${styles[request.Status.toLowerCase()]}`}>{request.Status}</div>
              <div className={styles.carImageContainer}>
                <Image
                  src={request.images[0].img1} // Assuming images array exists in request
                  alt={request.car_name}
                  width={300}
                  height={200}
                  className={styles.carImage}
                />
                <p className={styles.viewMore}>View Details</p>
              </div>
              <div className={styles.requestDetails}>
                <h3>{request.car_name}</h3>
                <p><strong>Car No:</strong> {request.reg_plate}</p>
                <p><strong>Requested by:</strong> {request.userName}</p>
                <p><strong>Rental Period:</strong> {formatDate(request.StartDate)} to {formatDate(request.EndDate)}</p>
              </div>
              <div className={styles.requestActions}>
                {request.Status === 'Pending' && (
                  <>
                    <button className={styles.acceptBtn}>Accept</button>
                    <button className={styles.denyBtn}>Deny</button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No new requests.</p>
        )}
      </div>
      {/* ChatArea component */}
      {isChatOpen && (
        <div className={styles.chatContainer}>
          <ChatArea customerName={chatCustomer} onBack={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default OrderRequests;
