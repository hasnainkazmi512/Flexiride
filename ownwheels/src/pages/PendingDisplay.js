import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/pending.module.css'; // Use CSS Modules
import Img1 from '../../public/images/img01.jpg'; // Ensure the path is correct
import ChatArea from './chatArea'; // Import the ChatArea component

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [Dealorders, setDealOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For showing alert
  const [chatCustomer, setChatCustomer] = useState(''); // For customer chat
  const [isChatOpen, setIsChatOpen] = useState(false); // To toggle chat
  const [showAlert, setShowAlert] = useState(false); // To toggle the alert
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('auth-token');
      console.log("Auth token:", token);

     
      try {
        // Fetch order requests
        const orderRequestsResponse = await axios.get('http://localhost:3000/api/orderRent', {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });
        const data = await response.json();
console.log("API Response:", data); 

if (!data || !data.data) {
  console.error("Invalid API response format:", data);
  return;
}

const { orders, rents } = data.data; 

        const combinedRequests = orders.map(order => {
          const rentDetails = rents.find(rent => rent._id === order.productID);
          return {
            ...order,
            car_name: rentDetails?.car_name || 'Unknown Car',
            reg_plate: rentDetails?.reg_plate || 'N/A',
            images: rentDetails?.images || [{ img1: '' }],
          };
        });
        
        const filteredRequests = combinedRequests.filter(
          data => data.order_type === 1 || data.order_type === 2 || data.order_type === 0
        );
        setOrders(filteredRequests);
      } catch (error) {
        console.error('Error fetching order requests:', error.response?.data || error.message);
      }
    };

    fetchRequests();
  }, []);

  const handleMarkAsPaid = (order) => {
    setSelectedOrder(order);
    setShowAlert(true); // Show the confirmation alert
  };
  console.log(Dealorders)

  const confirmMarkAsPaid = async() => {
    try {
      const response = await fetch(`http://localhost:3000/api/money_status?_id=${selectedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ 
          status : "Paid",
          order_type:0
        }),
        });
  
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        console.log(data.success);
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
    setShowAlert(false); // Close the alert
  };

  const handleChatClick = (customerName) => {
    setChatCustomer(customerName);
    setIsChatOpen(true);
  };

  const handleBackFromChat = () => {
    setIsChatOpen(false); // Close the chat and show the order list
  };
console.log(orders)
  return (
    <div className={styles['pendingOrdersContainer']}>
      <h2 className={styles['pageTitle']}>Pending Orders</h2>

      <div className={styles['ordersList']}>
        {orders.length === 0 ? (
          <p>No pending orders.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className={styles['orderCard']}>
              <div className={styles['orderHeader']}>
                <h3 className={styles['carName']}>{order.car_name}</h3>
                <span
                  className={
                    order.money_status === 'Pending'
                      ? styles['pendingTag']
                      : styles['completedTag']
                  }
                >
                  {order.money_status}
                </span>
              </div>
              <Image
                src={order.images[0].img1}
                alt={order.car_name}
                className={styles['carImage']}
                width={500}
                height={300}
                layout="responsive"
              />
              <div className={styles['orderDetails']}>
                <p><strong>Customer:</strong> {order.userName}</p>
                <p><strong>Rental Period:</strong> {new Date(order.StartDate).toISOString().substring(0, 10)} to {new Date(order.EndDate).toISOString().substring(0, 10)}</p>
                <p><strong>Completion Date:</strong> {new Date(order.EndDate).toISOString().substring(0, 10)}</p>
              </div>

              {/* Show buttons only if the order is still pending */}
              {order.money_status === 'Pending' && (
                <div className={styles['buttonContainer']}>
                  <button
                    className={styles['markAsPaidBtn']}
                    onClick={() => handleMarkAsPaid(order)}
                  >
                    Mark as Paid
                  </button>
                  <button
                    className={styles['chatBtn']}
                    onClick={() => handleChatClick(order.userName)}
                  >
                    Chat with {order.userName}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Styled confirmation alert */}
      {showAlert && (
        <div className={styles['alertOverlay']}>
          <div className={styles['alertBox']}>
            <h3>Confirm Payment</h3>
            <p>
              Are you sure you want to mark the order for{' '}
              <strong>{selectedOrder?.carName}</strong> as paid?
            </p>
            <div className={styles['alertButtons']}>
              <button
                className={styles['confirmBtn']}
                onClick={confirmMarkAsPaid}
              >
                Confirm
              </button>
              <button
                className={styles['cancelBtn']}
                onClick={() => setShowAlert(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area displayed in the bottom right corner */}
      {isChatOpen && (
        <div className={styles['chatOverlay']}>
          <div className={styles['chatModal']}>
            <ChatArea customerName={chatCustomer} onBack={handleBackFromChat} />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default PendingOrders;
