// components/UserNav.js
import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/userdashboard.module.css'; // Use CSS Module

const UserNav = ({ userName, userEmail, handleSignout, setSelectedOption, setShowChangePassword }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // Dropdown visibility state
  const dropdownRef = useRef(null); // Ref for detecting clicks outside dropdown

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    if(localStorage.getItem('type') === 'Admin'){

    }
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

  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
    setSelectedOption(''); // Reset selected option
    setDropdownVisible(false); // Close dropdown
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src="images/logo1.png" alt="FlexiRide Logo" className={styles.logoImg} />
        <span>FlexiRide</span>
      </div>
      <ul className={styles.navLinks}>
        <li><span>Services</span></li>
        <li><span>About Us</span></li>
        <li><span>Partners</span></li>
        <li className={styles.profileContainer}>
          <span className={styles.profileSection} onClick={toggleDropdown}>
            <img src={userimage} alt="Profile" className={styles.profileIcon} />
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
  );
};

export default UserNav;
