import { useState,useEffect } from 'react';
import Image from 'next/image'; // Ensure you use 'next/image' for optimized images
import styles from '../../styles/profile.module.css';
import ConfirmationModal from '../ConfirmationModal'; // Adjust the path if necessary

const CustomerProfile = () => {
  
  const [customer, setCustomer] = useState({
    name:"",
    image:"",
    email:"",
    CNIC:"",
    phone_number:""
  }); 
  const [isEditing, setIsEditing] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateRes,setUpdateRes] = useState(false);
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };
  useEffect(() => {
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
          setCustomer(data)
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        // setError('Error fetching data');
      }
    };

    fetchUserData();
  }, []);
  const handleSaveChanges = async () => {
    setIsEditing(false);
    console.log(localStorage.getItem('auth-token'))
    try {
      // Send data to backend via fetch API
      const response = await fetch('http://localhost:3000/api/updataUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
        },
        body: JSON.stringify(customer), // Send the customer data
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setUpdateRes(data.success || 'User successfully logged in!');
    
      } else {
        setUpdateRes(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setUpdateRes('An error occurred while logging in. Please try again.');
    }
    console.log("Profile Updated", customer);
  };

  const handleDeleteAccount = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Account deleted. CNIC No:", customer.idCard);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.customerProfile}>
      <div className={styles.profileHeader}>
        <Image
          src={customer.image}
          alt="Profile"
          width={120}
          height={120}
          className={styles.profileIcon}
        />
        <h2 className={styles.customerName}>{customer.name}</h2>
      </div>

      <div className={styles.profileDetails}>
        <table className={styles.profileTable}>
          <tbody>
            <tr>
              <td className={styles.fieldName}>Name:</td>
              <td className={styles.fieldValue}>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                ) : (
                  customer.name
                )}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>Phone Number:</td>
              <td className={styles.fieldValue}>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone_number"
                    value={customer.phone_number}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                ) : (
                  customer.phone_number
                )}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>ID Card:</td>
              <td className={styles.fieldValue}>
                {isEditing ? (
                  <input
                    type="text"
                    name="CNIC"
                    value={customer.CNIC}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                ) : (
                  customer.CNIC
                )}
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>Email:</td>
              <td className={styles.fieldValue}>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                ) : (
                  customer.email
                )}
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>

      <div className={styles.profileActions}>
        {isEditing ? (
          <button className={`${styles.profileButton} ${styles.save}`} onClick={handleSaveChanges}>Save Changes</button>
        ) : (
          <button className={`${styles.profileButton} ${styles.edit}`} onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
        <button className={`${styles.profileButton} ${styles.delete}`} onClick={handleDeleteAccount}>Delete Account</button>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
      />
    </div>
  );
};

export default CustomerProfile;
