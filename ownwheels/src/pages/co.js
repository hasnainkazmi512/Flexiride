import React, { useState, useEffect } from 'react';
import styles from '../styles/co.module.css'; // Assuming you renamed co.css to co.module.css


// Format date helper function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dealCom,setdealCom] = useState([])
  useEffect(() => {
    const fetchRequests = async () => {
      
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('http://localhost:3000/api/orderDealReq', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch order requests');
          return;
        }

        const data = await response.json();
        const { orders, rents } = data.data;
        
        // Combine orders with corresponding rents data
        const combinedData = orders.map((order) => {
          const rentDetails = rents.find((rent) => rent._id === order.productID );
          return {
            ...order,
            car_name: rentDetails?.title || 'Unknown Car',
            reg_plate: rentDetails?.desc || 'N/A',
            images: rentDetails?.images || ['/default-image.jpg'],
          };
        });
        const filteredData = combinedData.filter((data) => (data.order_type === 1 || data.order_type === 2 ||data.order_type === 0 )&& data.money_status === "Paid");
        setdealCom(filteredData);
      } catch (error) {
        console.error('Error fetching order requests:', error);
      }
    };

    fetchRequests();
  }, [dealCom]);


  const openModal = (order, index) => {
    setSelectedOrder(order);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedOrder && currentImageIndex < selectedOrder.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedOrder && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.car_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.completedOrdersPage}>
      <h1>Completed Orders</h1>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Search by Customer or Car Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      <div className={styles.completedOrdersContainer}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className={styles.completedOrderCard}>
              <div className={styles.completedBadge}>Completed</div>

              <div className={styles.carImageContainer} onClick={() => openModal(order, 0)}>
                <img src={order.images[0][`img${currentImageIndex + 1}`]} alt={order.car_name} className={styles.carImage} />
                <p className={styles.viewMore}>View Details</p>
              </div>
              <div className={styles.orderDetails}>
                <h3>{order.car_name}</h3>
                <p><strong>Car No:</strong> {order.reg_plate}</p>
                <p><strong>Customer:</strong> {order.userName}</p>
                <p><strong>Rental Period:</strong> {formatDate(order.StartDate)} to {formatDate(order.EndDate)}</p>
                <p><strong>Completion Date:</strong> {formatDate(order.EndDate)}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No completed orders found.</p>
        )}
      </div>

      {modalOpen && selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeModal} onClick={closeModal}>&times;</span>
            <div className={styles.imageContainer}>
              <button className={styles.prevBtn} onClick={prevImage} disabled={currentImageIndex === 0}>&lt;</button>
              <img src={selectedOrder.images[0][`img${currentImageIndex + 1}`]} alt={selectedOrder.car_name} className={styles.modalImage} />
              <button className={styles.nextBtn} onClick={nextImage} disabled={currentImageIndex === selectedOrder.images.length - 1}>&gt;</button>
            </div>
            <div className={styles.modalDetails}>
              <h3>{selectedOrder.car_name}</h3>
              <p><strong>Car No:</strong> {selectedOrder.reg_plate}</p>
              <p><strong>Customer:</strong> {selectedOrder.userName}</p>
              <p><strong>Rental Period:</strong> {formatDate(selectedOrder.StartDate)} to {formatDate(selectedOrder.EndDate)}</p>
              <p><strong>Completion Date:</strong> {formatDate(selectedOrder.EndDate)}</p>
            </div>
          </div>
        </div>
      )}
       <div className={styles.completedOrdersContainer}>
        {dealCom.length > 0 ? (
          dealCom.map((order) => (
            <div key={order._id} className={styles.completedOrderCard}>
              <div className={styles.completedBadge}>Completed</div>

              <div className={styles.carImageContainer} onClick={() => openModal(order, 0)}>
                <img src={order.images[0][`img${currentImageIndex + 1}`]} alt={order.car_name} className={styles.carImage} />
                <p className={styles.viewMore}>View Details</p>
              </div>
              <div className={styles.orderDetails}>
                <h3>{order.car_name}</h3>
                <p><strong>Rental :</strong> {order.reg_plate}</p>
                <p><strong>Customer:</strong> {order.userName}</p>
                <p><strong>Rental Period:</strong> {formatDate(order.StartDate)} to {formatDate(order.EndDate)}</p>
                <p><strong>Completion Date:</strong> {formatDate(order.EndDate)}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No completed orders found.</p>
        )}
      </div>
        
      {modalOpen && selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeModal} onClick={closeModal}>&times;</span>
            <div className={styles.imageContainer}>
              <button className={styles.prevBtn} onClick={prevImage} disabled={currentImageIndex === 0}>&lt;</button>
              <img src={selectedOrder.images[0][`img${currentImageIndex + 1}`]} alt={selectedOrder.car_name} className={styles.modalImage} />
              <button className={styles.nextBtn} onClick={nextImage} disabled={currentImageIndex === selectedOrder.images.length - 1}>&gt;</button>
            </div>
            <div className={styles.modalDetails}>
              <h3>{selectedOrder.car_name}</h3>
              <p><strong>Rental :</strong> {selectedOrder.reg_plate}</p>
              <p><strong>Customer:</strong> {selectedOrder.userName}</p>
              <p><strong>Rental Period:</strong> {formatDate(selectedOrder.StartDate)} to {formatDate(selectedOrder.EndDate)}</p>
              <p><strong>Completion Date:</strong> {formatDate(selectedOrder.EndDate)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedOrders;
