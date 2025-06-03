import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/orderrequests.module.css';
import ChatArea from './chatArea'; // Import the ChatArea component
import Deals from '../../models/Deals';
import RentDisplay from './RentDisplay';
import axios from 'axios';
import PendingOrders from './pending';

const OrderRequests = () => {// Initialize with empty requests
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatCustomer, setChatCustomer] = useState('');
  const [Deals,setDeals] = useState([]);
  const [requests, setRequests] = useState([]);
  // Fetch order requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('auth-token');
      console.log("Auth token:", token);

      try {
        // Fetch order deals
        const orderDealsResponse = await axios.get('http://localhost:3000/api/orderDealReq', {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        const { orders, rents } = orderDealsResponse.data.data;

        const combinedDeals = orders.map((order) => {
          const rentDetails = rents.find((rent) => rent._id === order.productID);
          return {
            ...order,
            car_name: rentDetails?.title || 'Unknown Car',
            reg_plate: rentDetails?.desc || 'N/A',
            images: rentDetails?.images || ['/default-image.jpg'],
          };
        });

        const filteredDeals = combinedDeals.filter(
          (data) => data.order_type === 1 || data.order_type === 2 || data.order_type === 0
        );
        setDeals(filteredDeals);
      } catch (error) {
        console.error('Error fetching order deals:', error.response?.data || error.message);
      }
    };

    fetchRequests();
  }, []);
  console.log(Deals)
  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/acceptedStatus?_id=${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ 
          status : "Accepted",
          order_type:0
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.success);
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
    setModalOpen(false);
  };

  const handleDeny = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/acceptedStatus?_id=${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ 
          status : "Deny",
          order_type:2
        }),
        });
  
      const data = await response.json();
      if (response.ok) {
        console.log(data.success);
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
    setModalOpen(false);
  };

  const openModal = (request, index) => {
    setSelectedRequest(request);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const nextImage = () => {
    if (selectedRequest && currentImageIndex < selectedRequest.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedRequest && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleChatClick = (customerName) => {
    setChatCustomer(customerName);
    setIsChatOpen(true);
  };

  const handleBackFromChat = () => {
    setIsChatOpen(false);
  };
  return (
    <div>
      <h1 style={{ color:"white",paddingLeft: '180px', paddingTop: '15px' }}>Order Requests</h1>

      <div className={styles.requestsContainer}>
        {Deals.length > 0 ? (
          Deals.map((request) => (
            <div key={request._id} className={styles.requestCard}>
              <div
                className={`${styles.statusLabel} ${styles[request.Status.toLowerCase()]}`}
              >
                {request.Status}
              </div>
              <div
                className={styles.carImageContainer}
                onClick={() => openModal(request, 0)}
              >
                <Image
                  src={request.images[0][`img${currentImageIndex + 1}`]}
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
                <p><strong>Rental Period:</strong> {new Date(request.StartDate).toISOString().substring(0, 10)} to {new Date(request.EndDate).toISOString().substring(0, 10)}</p>
              </div>
              <div className={styles.requestActions}>
                {request.Status === 'Pending' && (
                  <>
                    <button
                      className={styles.acceptBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccept(request._id);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.denyBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeny(request._id);
                      }}
                    >
                      Deny
                    </button>
                  </>
                )}
                {request.status === 'Accepted' && (
                  <button
                    className={styles.chatBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChatClick(request.userName);
                    }}
                  >
                    Chat with {request.userName}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{color:"red"}}>No new requests.</p>
        )}
      </div>

      {modalOpen && selectedRequest && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.closeModal} onClick={closeModal}>
              &times;
            </span>
            <p
              className={`${styles.statusLabelModal} ${styles[selectedRequest.Status.toLowerCase()]}`}
            >
              {selectedRequest.Status}
            </p>
            <div className={styles.imageContainer}>
              <button
                className={styles.prevBtn}
                onClick={prevImage}
                disabled={currentImageIndex === 0}
              >
                &lt;
              </button>
              <Image
                src={selectedRequest.images[0][`img${currentImageIndex + 1}`]}
                alt={selectedRequest.carName}
                width={600}
                height={400}
                className={styles.modalImage}
              />
              <button
                className={styles.nextBtn}
                onClick={nextImage}
                disabled={currentImageIndex === selectedRequest.images.length - 1}
              >
                &gt;
              </button>
            </div>
            <div className={styles.modalDetails}>
              <h3>{selectedRequest.car_name}</h3>
              <p>Car No: {selectedRequest.reg_plate}</p>
              <p>Requested by: {selectedRequest.userName}</p>
              <p>Rental Period: {selectedRequest.StartDate} to {selectedRequest.EndDate}</p>
              <div className={styles.modalActions}>
                {selectedRequest.Status === 'Pending' && (
                  <>
                    <button
                      className={styles.acceptBtn}
                      onClick={() => handleAccept(selectedRequest._id)}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.denyBtn}
                      onClick={() => handleDeny(selectedRequest._id)}
                    >
                      Deny
                    </button>
                  </>
                )}
                {selectedRequest.Status === 'Accepted' && (
                  <button
                    className={styles.chatBtn}
                    onClick={() => handleChatClick(selectedRequest.userName)}
                  >
                    Chat with {selectedRequest.userName}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className={styles.chatContainer}>
          <ChatArea customerName={chatCustomer} onBack={handleBackFromChat} />
        </div>
      )}
      <RentDisplay/>
      {isChatOpen && (
        <div className={styles.chatContainer}>
          <ChatArea customerName={chatCustomer} onBack={handleBackFromChat} />
        </div>
      )}
    </div>
  );
};

export default OrderRequests;
