"use client";
import React, { useState } from 'react';
import styles from '../styles/CustomRent.module.css';
import Navbar from './Navbar';
import Footer from './Footer';

const CustomRent = () => {
  const [formData, setFormData] = useState({
    budget: '',
    description: '',
    preferredDates: '',
    location: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure preferredDates is always sent as a string
      const payload = {
        ...formData,
        preferredDates: formData.preferredDates // already a string from input
      };

      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('auth-token') || ''
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Request submitted successfully!');
        setFormData({
          budget: '',
          description: '',
          preferredDates: '',
          location: ''
        });
      } else {
        setMessage(data.error || 'Failed to submit request');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1>Custom Rent Request</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Budget (PKR)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Preferred Dates (comma separated)</label>
            <input
              type="text"
              name="preferredDates"
              value={formData.preferredDates}
              onChange={handleChange}
              placeholder="e.g. 2024-12-01, 2024-12-15"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Submit Request
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CustomRent;