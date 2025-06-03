import React, { useState, useEffect, useRef, use } from 'react';
import styles from '../styles/userdashboard.module.css'; // Use CSS Module
import OrderRequests from './orderrequests.js';
import Profile from './profile.js';
import ChangePassword from './change-password';
import PendingOrders from './pending';
import CompletedOrders from './co';
import RequestedCars from './requested-cars';
import YourCars from './your-cars'; // Import the YourCars component
import CustomRequests from './custom-requests'; // New import
import MyCustomRequests from './MyCustomRequests';
import Chatbot from './Chatbot';

const Dashboard = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility
  const [selectedOption, setSelectedOption] = useState(''); // State to track selected option
  const [showChangePassword, setShowChangePassword] = useState(false); // New state for Change Password view
  const [userName,setUserName] = useState("");
  const [userEmail,setUserEmail] = useState("");
  const[userImage,setUserImage]=useState("");

  useEffect(() => {
    if(!localStorage.getItem('auth-token')){
      window.location.href = '/';
    }
    if(localStorage.getItem('type') === "Admin" && localStorage.getItem('auth-token')){
      window.location.href = '/admin';
    }
    console.log(localStorage.getItem('auth-token'))
    const fetchUserData = async () => {
      try {
        // Assuming the API returns user data
        const response = await fetch('http://localhost:3000/api/getUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
          },
        });
        const data = await response.json();
        
        if (response.ok) {
          setUserEmail(data.email);
          setUserName(data.name);
          setUserImage(data.image)
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.log("error in fetching")
      }
    };

    fetchUserData();
  }, []);
  // Dummy user data
  

  // Ref to the dropdown menu
  const dropdownRef = useRef(null);

  const handleSignout = () => {
    localStorage.removeItem('auth-token');
      window.location.href = '/';
  };

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev);
  };

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev); // Toggle sidebar visibility
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  // Handle dynamic content display based on selected option
  const renderContent = () => {
    if (showChangePassword) {
      return <ChangePassword />; // Display ChangePassword component
    }
    
    switch (selectedOption) {
      case 'orderRequests':
        return <OrderRequests />;
      case 'profile':
        return <Profile />;
      case 'inProgressOrders':
        return <PendingOrders />;
      case 'completedOrders':
        return <CompletedOrders />;
      case 'requestedCars':
        return <RequestedCars />;
      case 'YourCars': // New case for displaying YourCars component
        return <YourCars />;
      case 'customRequests': // New case for custom requests
        return <CustomRequests />;
        case 'myCustomRequests':  // Make sure this matches exactly what you use in the sidebar
        return <MyCustomRequests />;
      default:
        return (
          <div className={styles.serviceContent}>
            <h2>Welcome to Your Dashboard</h2>
            <p>Select an option from the left to view corresponding services.</p>
          </div>
        );
    }
  };

  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
    setSelectedOption(''); // Reset selected option
    setDropdownVisible(false); // Close dropdown
  };

  return (
    <div className={styles.dashboard}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="images/logo10.png" alt="FlexiRide Logo" className={styles.logoImg} />
          <span>FlexiRide</span>
          <button className={styles.arrowButton} onClick={toggleSidebar}>
            {sidebarVisible ? '▲' : '▼'}
          </button>
        </div>
        <ul className={styles.navLinks}>
          <li><span><a style={{color:"white",textDecoration:"none"}} href='./Services'>Services</a></span></li>
          <li><span><a style={{color:"white",textDecoration:"none"}} href='./AboutUs'>About Us</a></span></li>
          <li><span><a style={{color:"white",textDecoration:"none"}} href='./Partners'>Partners</a></span></li>
          <li className={styles.profileContainer}>
            <span className={styles.profileSection} onClick={toggleDropdown}>
              <img src={userImage} alt="Profile" className={styles.profileIcon} />
            </span>

            {dropdownVisible && (
              <div className={styles.dropdownMenu} ref={dropdownRef}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.userName}>{userName}</p>
                  <p className={styles.userEmail}>{userEmail}</p>
                </div>
                <ul className={styles.dropdownOptions}>
                  <li onClick={() => { setSelectedOption('profile'); setShowChangePassword(false); }}>Profile</li>
                  <li onClick={handleChangePasswordClick}>Change Password</li>
                  <li><span onClick={handleSignout}>Sign Out</span></li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>

      <div className={styles.dashboardContent}>
        {/* Render sidebar only if visible */}
        {sidebarVisible && (
          <div className={styles.sidebar}>
            <ul>
              <li onClick={() => { setSelectedOption('profile'); setShowChangePassword(false); }}><span>Profile</span></li>
              <li  onClick={() => { setSelectedOption('requestedCars'); setShowChangePassword(false); }}><span style={{color:"white"}}>Requested Cars</span></li>
              <p style={{ color: 'white', marginBottom: '1em' }}>--------------------------</p>
              <li onClick={() => { setSelectedOption('YourCars'); setShowChangePassword(false); }}><span>Your Cars</span></li> {/* Updated for Your Cars */}
              <li onClick={() => { setSelectedOption('myCustomRequests'); setShowChangePassword(false); }}><span>All Bids</span></li>
              <li onClick={() => { setSelectedOption('customRequests'); setShowChangePassword(false); }}><span>Custom Requests</span></li>
              <li onClick={() => { setSelectedOption('orderRequests'); setShowChangePassword(false); }}><span>Order Requests</span></li>
              <li onClick={() => { setSelectedOption('inProgressOrders'); setShowChangePassword(false); }}><span>In Progress Orders</span></li>
              <li onClick={() => { setSelectedOption('completedOrders'); setShowChangePassword(false); }}><span>Completed Orders</span></li>
            </ul>
          </div>
        )}

        {/* Render dynamic service content based on selected option */}
        {renderContent()}
        <Chatbot />
      </div>
    </div>
  );
};

export default Dashboard;
