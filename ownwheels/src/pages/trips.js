import React, { useState } from 'react';
import FilterComponent2 from './FilterComponent2'; 
import VehicleListComponent2 from './VehicleListComponent2'; 
import Nav from './Navbar'

// Sample vehicle data (You can replace this with actual data from your backend)
const vehicleData = [
  {
    id: 1,
    name: 'Toyota Corolla',
    image: '/images/toyota-image.jpg', // Update the path based on your public directory
    type: 'Cars with Drivers',
  },
  {
    id: 2,
    name: 'Honda Civic',
    image: '/images/honda-image.jpg', // Update the path based on your public directory
    type: 'Cars without Drivers',
  },
  // Add more vehicles here
];

const HomePage = () => {
  const [filteredVehicles, setFilteredVehicles] = useState(vehicleData);

  // Function to handle filter changes from FilterComponent2
  const handleFilter = (filterTerm, searchTerm) => {
    if (!filterTerm && !searchTerm) {
      // If no filter term, show all vehicles
      setFilteredVehicles(vehicleData);
    } else {
      // Apply filtering based on the search term or car type
      const filtered = vehicleData.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(filterTerm.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
  };

  return (
    <div className="App">
      <div className="main-layout">
        {/* Pass vehicles to FilterComponent2 for searching */}
        <Nav/>
        <FilterComponent2 onFilter={handleFilter} vehicles={vehicleData} />
        {/* Pass the filtered vehicles to VehicleListComponent2 */}
        <VehicleListComponent2 vehicles={filteredVehicles} />
      </div>
    </div>
  );
};

export default HomePage;
