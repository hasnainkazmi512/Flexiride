import React, { useState,useEffect } from "react";
import RentSearchBar from "./RentSearchBar";
import RentHotOffers from "./RentHotOffers";
import RentAllOffers from "./RentAllOffers";
import Navbar from "./Navbar";
import styles from '../styles/Main.module.css';
import Footer from "./Footer";



const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [filteredOffers, setFilteredOffers] = useState([]); // To store filtered offers
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the API
        const response = await fetch('http://localhost:3000/api/viewRentAd', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
            'options': 'all',
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          setFilteredOffers(data.data) // Assuming 'ads' is the key holding the car data
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError('Error fetching data');
      } finally {
      }
    };

    fetchUserData();
  }, []);
  const [offers] = useState([
    {
      id: 1,
      name: "HONDA CIVIC 2024",
      price: "Rps 5000/day",
      availableFrom: "2024-12-01",
      availableTo: "2024-12-15",
      model: 2024,
      colour: "white",
      transmission: "auto",
      mileage: "50,000 kms",
      hasDriver: false,
    },
    {
      id: 2,
      name: "Toyota Prado 2023",
      price: "Rps 12000/day",
      availableFrom: "2024-12-10",
      availableTo: "2024-12-20",
      model: 2012,
      colour: "black",
      transmission: "auto",
      mileage: "70,000 kms",
      hasDriver: true,
    },
  ]);

  return (
    <div className={styles.Main}>
      <Navbar/>
      <RentSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        cars={filteredOffers}
        setFilteredOffers={setFilteredOffers} // Pass setFilteredOffers to filter offers
      />
      <RentAllOffers filteredOffers={filteredOffers} setSearchTerm={setSearchTerm} />
      <RentHotOffers offers={offers} />
      <Footer/>
    </div>
  );
};

export default Home;
