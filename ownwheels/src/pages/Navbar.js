import React, { useState } from 'react';
import styles from '../styles/Navbar.module.css';
import Image from 'next/image';
import logoimage from '../../public/images/logo20.png';
import google from '../../public/images/google-icon.png';

const Navbar = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    CNIC: '',
    password: '',
    confirmPassword: '',
    image: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [loginresponseMessage, setloginResponseMessage] = useState('');
  const [userType, setUserType] = useState('user'); // Default to 'user'


  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegisterFormData((prevData) => ({
          ...prevData,
          image: reader.result, // Base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Register Submit Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerFormData.password !== registerFormData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log(registerFormData)
    try {
      // Send data to backend via fetch API
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },        
        body: JSON.stringify(registerFormData) // Send the formData here
      });

      const data = await response.json();
      if (response.ok) {
        setResponseMessage(data.success || 'User successfully registered!');
        // Reset form
        setRegisterFormData({
          name: '',
          email: '',
          phone_number: '',
          CNIC: '',
          password: '',
          confirmPassword: '',
          image: '',
        });
        setRegisterModalOpen(false);
      } else {
        setResponseMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setResponseMessage('An error occurred while registering. Please try again.');
    }
  };

  // Login Submit Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, password, userType });

    try {
        console.log("admin status", isAdminLogin);
        const UserType = isAdminLogin ? "admin" : "user";

        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, UserType }), // Send the formData here
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            setloginResponseMessage(data.success || "User successfully logged in!");
            setEmail("");
            setPassword("");
            localStorage.setItem("auth-token", data.token);
            localStorage.setItem("type", data.usertype);
            
            if (data.usertype === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/userdashboard";
            }
        } else {
            // Show an alert if no user is found
            if (data.error === "No user found with this email") {
                alert("No such user found! Please check your email or sign up.");
                setEmail("");
                 setPassword("");
            }
            setloginResponseMessage(data.error || "Something went wrong. Please try again.");

            setLoginModalOpen(false);
        }
    } catch (err) {
        console.error("Error:", err);
        setResponseMessage("An error occurred while logging in. Please try again.");
        setLoginModalOpen(false);
    }
};


  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Image src={logoimage} alt="FlexiRide Logo" width={100} height={40} className={styles.logoImg} />
          FlexiRide
        </div>
        <ul className={styles.navLinks}>  
          <li><a href="./Services">Services</a></li>
          <li><a href="./AboutUs">About Us</a></li>
          <li><a href="./Partners">Partners</a></li>
          <li><a href="#" onClick={() => setLoginModalOpen(true)}>Login</a></li>
          <li><a href="#" onClick={() => setRegisterModalOpen(true)}>Register</a></li>
        </ul>
      </nav>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setLoginModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2>{isAdminLogin ? 'Admin Login' : 'User Login'}</h2>
            <div className={styles.toggleLogin}>
              <button
                className={!isAdminLogin ? styles.activeToggle : ''}
                onClick={() => setIsAdminLogin(false)}
              >
                User Login
              </button>
              <button
                className={isAdminLogin ? styles.activeToggle : ''}
                onClick={() => setIsAdminLogin(true)}
              >
                Admin Login
              </button>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">{isAdminLogin ? 'Login as Admin' : 'Login as User'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setRegisterModalOpen(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={registerFormData.name}
                  onChange={(e) =>
                    setRegisterFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerFormData.email}
                  onChange={(e) =>
                    setRegisterFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone No:</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={registerFormData.phone_number}
                  onChange={(e) =>
                    setRegisterFormData((prev) => ({ ...prev, phone_number: e.target.value }))
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>ID-Card No:</label>
                <input
                  type="text"
                  placeholder="Enter your ID-card number"
                  value={registerFormData.CNIC}
                  onChange={(e) =>
                    setRegisterFormData((prev) => ({ ...prev, CNIC: e.target.value }))
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Password:</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={registerFormData.password}
                  onChange={(e) =>
                    setRegisterFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm Password:</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={registerFormData.confirmPassword}
                  onChange={(e) =>
                    setRegisterFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Upload Image:</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} required />
              </div>
              {registerFormData.image && (
                <div>
                  <p>Image Preview:</p>
                  <img
                    src={registerFormData.image}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
              )}
              <button type="submit">Register</button>
            </form>

            <div className={styles.googleAuth}>
              <button className={styles.googleBtn}>
                <Image src={google} alt="Google" width={24} height={24} className={styles.googleIcon} />
                Continue with Google
              </button>
            </div>
            {responseMessage && <p>{responseMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
