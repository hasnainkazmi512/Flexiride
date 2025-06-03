import React from 'react';
import { FaCheckCircle, FaSearch } from 'react-icons/fa';

const MyComponent = () => {
  return (
    <div>
      <h1>My Dashboard</h1>
      <button>
        <FaCheckCircle /> Complete Order
      </button>
      <button>
        <FaSearch /> Search Orders
      </button>
    </div>
  );
};

export default MyComponent;
