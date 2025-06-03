import React, { useState } from 'react';
import styles from '../styles/RentSearchBar.module.css'; // Ensure this path is correct

const RentSearchBar = ({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  cars,
  setFilteredOffers
}) => {
  const [vehicleType, setVehicleType] = useState('all');

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    filterOffers(vehicleType, query, startDate, endDate); // Trigger filtering when search term changes
  };

  const handleVehicleTypeChange = (e) => {
    const newType = e.target.value;
    setVehicleType(newType);
    filterOffers(newType, searchTerm, startDate, endDate); // Trigger filtering when vehicle type changes
  };

  const filterOffers = (type, search, start, end) => {
    const filtered = cars.filter((offer) => {
      const matchesSearch =
        search === '' || offer.car_name.toLowerCase().includes(search.toLowerCase());
      const matchesDate =
        (!start || new Date(offer.availableFrom) <= new Date(start)) &&
        (!end || new Date(offer.availableTo) >= new Date(end));
      const matchesType =
        type === 'all' ||
        (type === 'with-drivers' && offer.driver_status) ||
        (type === 'without-drivers' && !offer.driver_status);
      return matchesSearch && matchesDate && matchesType;
    });
    setFilteredOffers(filtered);
  };

  return (
    <div className={styles.RentSearchBar}> {/* Ensure this matches your CSS class */}
      <h1>RENT it!</h1>
      <input
        type="text"
        placeholder="Search vehicles by name..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <div className={styles['vehicle-type-filter']}> {/* Correct the class name */}
        <label>
          <input
            type="radio"
            value="all"
            checked={vehicleType === 'all'}
            onChange={handleVehicleTypeChange}
          />
          All Vehicles
        </label>
        <label>
          <input
            type="radio"
            value="with-drivers"
            checked={vehicleType === 'with-drivers'}
            onChange={handleVehicleTypeChange}
          />
          With Drivers
        </label>
        <label>
          <input
            type="radio"
            value="without-drivers"
            checked={vehicleType === 'without-drivers'}
            onChange={handleVehicleTypeChange}
          />
          Without Drivers
        </label>
      </div>
      <button onClick={() => filterOffers(vehicleType, searchTerm, startDate, endDate)}>
        Search
      </button>
    </div>
  );
};

export default RentSearchBar;
