import { useState } from 'react';
import styles from "../styles/admindashboard.module.css";
import Image from 'next/image';
import { useRouter } from 'next/router';

const TopNav = ({ onSearch, searchQuery }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleSearchChange = (e) => {
    onSearch(query); // Pass the query back to parent (Dashboard)
  };

  const handleProfileClick = () => {
    setShowDropdown((prev) => !prev); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    window.location.href = '/';
  };

  const handleProfileRedirect = () => {
    router.push('/admin/admins'); // Redirect to admin.js page
  };

  return (
    <header className={styles.topNav}>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchBarInput}
          placeholder="🔍  Search here..."
        />
      </div>
      <div className={styles.profileSection}>
        <span>Administrator</span>
        <div className={styles.profileIconWrapper}>
          <img
            src="/images/profile.jpg"
            alt="Profile Icon"
            className={styles.profileIcon}
            onClick={handleProfileClick}
          />
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button onClick={handleProfileRedirect}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
