import React, { useState,useEffect } from 'react';
import styles from '../styles/change-password.module.css'; // Use CSS modules for styling

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updateRes,setUpdateRes] = useState(false);

  const [customer, setCustomer] = useState({
    name:"",
    email:"",
    CNIC:"",
    phone_number:"",
    password: "",
    new_password:""
  });
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
        setError('Error fetching data');
      }
    };

    fetchUserData();
  }, []);
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Simple validation
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    // Reset messages
    setErrorMessage('');
    setSuccessMessage('Password changed successfully!');
    // Log the passwords to the console
      const response = await fetch('http://localhost:3000/api/changePass', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
        },
        body: JSON.stringify({customer,newPassword}), // Send the customer data
      });

      const data = await response.json();
      console.log(response.ok)
      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
    
      } else {
        setSuccessMessage('Password Not changed successfully!');
      }
    console.log("Profile Updated", customer);

    // Here you would typically send the updated password to your backend
    // Call an API to update the password in your backend

    // Reset form fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={styles.passwordChangeContainer}>
      <h2 classname={styles.heading}>Change Password</h2>
      <form onSubmit={handlePasswordChange} className={styles.passwordChangeForm}>
        <table className={styles.passwordChangeTable}>
          <tbody>
            <tr>
              <td className={styles.fieldName}>Current Password:</td>
              <td className={styles.fieldValue}>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>New Password:</td>
              <td className={styles.fieldValue}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.fieldName}>Confirm New Password:</td>
              <td className={styles.fieldValue}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        <div className={styles.profileActionsCentered}>
          <button type="submit" className={styles.submitButton}>Change Password</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
