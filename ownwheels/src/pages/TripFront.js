import { useState,useEffect } from "react";
import SearchBar from "./SearchBar";
import HotOffers from "./HotOffers";
import AllOffers from "./AllOffers";
import CustomDemands from "./CustomDemands";
import Navbar from "./Navbar";
import Footer from "./Footer";


const Main = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [title] = useState("Trip Front");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customDemand, setCustomDemand] = useState("");
  const [filteredOffers, setFilteredOffers] = useState([]); // To store filtered offers
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the API
        const response = await fetch('http://localhost:3000/api/viewDeals', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${localStorage.getItem('auth-token')}`, // Include JWT token from localStorage
            'options': 'all',
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          const filteredData = data.all_quotation.filter((data) => (data.type_deal === "trip" ));
          setFilteredOffers(filteredData) // Assuming 'ads' is the key holding the car data
        } else {
        }
      } catch (error) {
      } finally {
      }
    };

    fetchUserData();
  }, []);
  console.log("marriage",filteredOffers)
  const [offers] = useState([
    {
      id: 1,
      name: "HONDA CIVIC 2024",
      image: "",
      price: "Rps 5000/day",
      availableFrom: "2024-12-01",
      availableTo: "2024-12-15",
      quantity: "4",
      model: 2024,
      colour: "white",
      transmission: "auto",
      mileage: "50,000 kms",
      
    },
    {
      id: 2,
      name: "Toyota Prado 2023",
      image: "Prado",
      price: "Rps 12000/day",
      availableFrom: "2024-12-10",
      availableTo: "2024-12-20",
      quantity: "2",
      model: 2023,
      colour: "black",
      transmission: "auto",
      mileage: "70,000 kms",
    },
  ]);


  const handleSubmitDemand = () => {
    alert(`Demand Submitted: ${customDemand}`);
    setCustomDemand("");
  };

  return (
    <div >
      < Navbar/>
      <SearchBar
        title={title}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        cars={filteredOffers} // Pass offers array here
      />
      <AllOffers filteredOffers={filteredOffers} setSearchTerm={setSearchTerm} />
      <HotOffers offers={offers} />
      <Footer/>
      
    </div>
  );
};

export default Main;
