import React, { useState, useEffect } from 'react';
import styles from './history.module.css';
import Image from 'next/image';

const History = () => {
  const [sampleHistory, setSampleHistory] = useState([]);
  const [rent, setRent] = useState([]);
  const [Deal, setDeals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('auth-token');
      try {
        const response = await fetch('http://localhost:3000/api/orderReq', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
            options: 'all',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch order requests');
          return;
        }

        const data = await response.json();
        const filteredData = data.data.all_order.filter((data) => (data.Status==="Accepted"));
        setSampleHistory(filteredData);
        setRent(data.data.rentData)
        setDeals(data.data.dealsData)
      } catch (error) {
        console.error('Error fetching order requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const openModal = (record, matchingDealsData, matchingRentData, index) => {
    // Merge the objects
    const mergedRecord = {
      ...record,
      ...matchingDealsData,
      ...matchingRentData,
    };
  
    // Set the merged object and other states
    setSelectedRecord(mergedRecord);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRecord(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedRecord && currentImageIndex < selectedRecord.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedRecord && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  console.log(selectedRecord)
  return (
    <div className={styles.historyPage}>
      <h1>Rental History</h1>
      <div className={styles.historyContainer}>
        {sampleHistory?.length > 0 ? (
          sampleHistory.map((record) => {
            const matchingRentData = rent?.find(
              (r) => r._id === record.productID
            );
            const matchingDealsData = Deal?.find(
              (d) => d._id === record.productID
            );
          return (
                      
            <div key={record._id} className={styles.historyCard}>
            <div
              className={styles.carImageContainer}
              onClick={() => openModal(record,matchingDealsData,matchingRentData, 0)}
            >
              <Image
                src={matchingRentData?.images[0].img1 ||matchingDealsData?.images[0].img1}
                alt={matchingRentData?.car_name || matchingDealsData?.title}
                width={500}
                height={300}
                className={styles.carImage}
              />
            </div>
            <div className={styles.recordDetails}>
              <h3>{matchingRentData?.car_name || matchingDealsData?.title}</h3>
              <p><strong>{matchingRentData?"Car No:":"Description :"}</strong> {matchingRentData?.reg_plate || matchingDealsData?.desc}</p>
              <p><strong>Customer:</strong> {matchingRentData?.UserName || matchingDealsData?.UserName}</p>
              <p>
                <strong>Rental Period:</strong> {formatDate(record.StartDate)} to {formatDate(record.EndDate)}
              </p>
              <p><strong>Completion Date:</strong> {formatDate(record.EndDate)}</p>
              <p><strong>{matchingRentData?"Color":"Special Instruction :"}</strong> {matchingRentData?.Color || matchingDealsData?.special_instruction}</p>
              <p><strong>{matchingRentData?"Transmission":"Package Type :"}</strong> {matchingRentData?.transmission || matchingDealsData?.type_deal}</p>
              <p>
                <strong>Status:</strong> <button className={styles.statusbtn}>{record.Status}</button>
              </p>
            </div>
          </div>
                    );}
          )
        ) : (
          <p>No history records found.</p>
        )}
      </div>
      {modalOpen && selectedRecord && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.closeModal} onClick={closeModal}>
              &times;
            </span>
            <div className={styles.imageContainer}>
              <button
                className={styles.prevBtn}
                onClick={prevImage}
                disabled={currentImageIndex === 0}
              >
                &lt;
              </button>
              <Image
                src={selectedRecord.images[0].img1}
                alt={selectedRecord.car_name || selectedRecord.title}
                className={styles.modalImage}
                width={500}
                height={300}
              />
            </div>
            <div className={styles.modalDetails}>
              <h3>{selectedRecord.carName}</h3>
              <p><strong>{selectedRecord.car_name?"Car No:":"Description :"}</strong> {selectedRecord.car_name || selectedRecord.title}</p>
              <p><strong>Customer:</strong> {selectedRecord.UserName}</p>
              <p>
                <strong>Rental Period:</strong> {formatDate(selectedRecord.StartDate)} to {formatDate(selectedRecord.EndDate)}
              </p>
              <p><strong>Completion Date:</strong> {formatDate(selectedRecord.EndDate)}</p>
              <p><strong>{selectedRecord.Color?"Color":"Special Instruction :"}</strong> {selectedRecord.Color || selectedRecord.special_instruction}</p>
              <p><strong>{selectedRecord.transmission?"Transmission":"Package Type :"}</strong> {selectedRecord.transmission || selectedRecord.type_deal}</p>
              <p><strong>Status:</strong> {selectedRecord.Status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
