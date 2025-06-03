import React from "react";
import styles from "../styles/SearchBar.module.css";

const SearchBar = ({
  title,
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  cars,
}) => {
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
  };

  return (
    <div className={styles.searchBar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Search vehicles by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.input}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={styles.input}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.input}
        />
        <button className={styles.button}>Search</button>
      </div>

     
    </div>
  );
};

export default SearchBar;
