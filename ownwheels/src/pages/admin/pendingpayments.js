import React, { useState, useEffect, useRef } from "react";
import styles from "./pendingpayments.module.css";

const PendingPayment = ({ searchQuery }) => {
  const [orders, setOrders] = useState([]);
  const [rent,setRent] = useState([]);
  const [Deals,setDeal] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, content: null });
  const modalRef = useRef(null); // Reference to the modal for focus

  const [reminder, setReminder] = useState(null);
  const [cancelAlert, setCancelAlert] = useState(null);

  // Focus on the modal when it opens
  useEffect(() => {
    if (modal.isOpen && modalRef.current) {
      modalRef.current.focus(); // Focus the modal when it's open
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orderReq", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('auth-token'),
            options: "all",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch order requests");
          return;
        }

        const data = await response.json();
        setOrders(data.data.all_order); // Update with the correct structure
        setRent(data.data.rentData);
        setDeal(data.data.dealsData);
      } catch (error) {
        console.error("Error fetching order requests:", error);
      }
    };

    fetchUserData();
  }, [orders]);

  // Handle sending reminder
  const handleSendReminder = (order) => {
    setReminder(`Reminder sent to ${order.email} or ${order.phone}`);
    setTimeout(() => setReminder(null), 3000);
  };

  // Handle marking order as paid
  const handleMarkAsPaid = async(_id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/money_status?_id=${_id}`, {
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
      if (response.ok) {
        console.log("asdfasdfasd",data.success);
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    
  };

  // Handle cancel order
  const handleCancelOrder = async (_id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/money_status?_id=${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ 
          status : "Canceled",
          order_type:4
        }),
        });
  
      const data = await response.json();
      if (response.ok) {
        console.log("asdfasdfasd",data.success);
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Confirm order cancellation
  const confirmCancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, isCancelled: true } : order
      )
    );
    setCancelAlert(null); // Close the alert box after cancellation
  };

  // Close cancel alert
  const closeCancelAlert = () => {
    setCancelAlert(null);
  };

  // View order details in a modal
  const handleViewDetails = (booking,matchingDealsData,matchingRentData) => {
    setModal({ isOpen: true, content: {booking,matchingDealsData,matchingRentData} });
  };

  // Close the modal
  const closeModal = () => {
    setModal({ isOpen: false, content: null });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pending Payments</h1>
      <div className={styles.cardContainer}>
      {orders
  .filter(booking => booking.money_status !== "Paid")  // ✅ Hides Paid Orders
  .map((booking) => {
    const matchingRentData = rent?.find(rent => rent._id === booking.productID);
    const matchingDealsData = Deals?.find(deal => deal._id === booking.productID);

    return (
      <div key={booking._id} className={`${styles.card} ${booking.Status ? styles.cancelledCard : ""}`}>
        <img 
          src={matchingRentData?.images[0]?.img1 || matchingDealsData?.images[0]?.img1}
          alt={matchingRentData?.car_name || matchingDealsData?.car_name} 
          className={styles.carImage} 
        />
        <h2 className={styles.cardTitle}>Order #{booking._id}</h2>
        <p className={styles.cardText}><strong>Owner:</strong> {matchingRentData?.UserName || matchingDealsData?.UserName}</p>
        <p className={styles.cardText}><strong>Car:</strong> {matchingRentData?.car_name || matchingDealsData?.title}</p>
        <p className={styles.cardText}><strong>Amount Due:</strong> {matchingRentData?.fare || matchingDealsData?.price}</p>
        <p className={styles.cardText}><strong>Due Date:</strong> {booking.EndDate}</p>

        {booking.Status === "Canceled" ? (
          <p className={styles.cancelledText}>Order Cancelled</p>
        ) : (
          <div className={styles.actions}>
            <button className={styles.detailsButton} onClick={() => handleViewDetails(booking, matchingDealsData, matchingRentData)}>View Details</button>
            <button className={styles.paidButton} onClick={() => handleMarkAsPaid(booking._id)}>Mark as Paid</button>
            <button className={styles.cancelButton} onClick={() => handleCancelOrder(booking._id)}>Cancel Order</button>
          </div>
        )}
      </div>
    );
  })}

      </div>

      {modal.isOpen && (
        <div className={styles.modal} role="dialog" aria-labelledby="modalTitle">
          <div
            ref={modalRef} // Attach focus reference here
            tabIndex="-1" // Ensures modal can be focused
            className={styles.modalContent}
            aria-hidden={!modal.isOpen}
          >
            <h2 id="modalTitle">Order Details</h2>
            <img
              src={modal.content.matchingDealsData?.images[0].img1 || modal.content.matchingRentData?.images[0].img1}
              alt={modal.content.car}
              className={styles.modalImage}
            />
            <p><strong>Owner :</strong> {modal.content.matchingRentData?.UserName || modal.content.matchingDealsData?.UserName}</p>
            <p><strong>Car:</strong> {modal.content.matchingRentData?.car_name || modal.content.matchingDealsData?.title}</p>
            <p><strong>Details:</strong> {modal.content.matchingRentData?.car_make || modal.content.matchingDealsData?.desc}</p>
            <p><strong>Amount:</strong> {modal.content.matchingRentData?.fare || modal.content.matchingDealsData?.price}</p>
            <p><strong>Due Date:</strong> {modal.content.booking.EndDate}</p>
            <button className={styles.closeModal} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}


      {cancelAlert && (
        <div className={styles.modal} role="dialog" aria-labelledby="cancelModalTitle">
          <div
            ref={modalRef} // Reuse modal reference for focus
            tabIndex="-1"
            className={styles.modalContent}
            aria-hidden={!cancelAlert}
          >
            <h2 id="cancelModalTitle">Cancel Order</h2>
            <p>{cancelAlert.message}</p>
            <div className={styles.cancelAlertButtons}>
              <button
                className={styles.confirmCancel}
                onClick={() => confirmCancelOrder(cancelAlert.orderId)}
              >
                Confirm Cancel
              </button>
              <button className={styles.closeModal} onClick={closeCancelAlert}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPayment;
