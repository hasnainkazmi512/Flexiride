import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import Clients from "../pages/admin/clients";
import styles from "../styles/admindashboard.module.css";
import AllCars from "../../src/pages/admin/allcars";
import History from "./admin/history";
import PendingPayment from "../pages/admin/pendingpayments";
import AdminPage from "./admin/admins";
import { Router } from "next/router";
import jwt from "jsonwebtoken";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [recentBookings, setRecentBookings] = useState({ all_order: [] }); // Initialize to avoid undefined issues
  const [Deals, setDeals] = useState([]);
  const [NOofUser,setnoUser] = useState([]);  
  const [NoCars,setNOcars] = useState([]);
  const [rev,setrev] =  useState([]);
  let Revnue = 0;
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    console.log(localStorage.getItem('type'))
    if (localStorage.getItem('type') === 'user' && localStorage.getItem('auth-token')){
        window.location.href = '/userdashboard';
    }
    else if (!token){
      window.location.href = '/';
    }
    const fetchRequests = async () => {
      try{
        const response = await fetch("http://localhost:3000/api/getNoCars", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        if(response.ok){
          const data = await response.json();
          setNOcars(data.data.NoCars)
        }
      } catch{
        console.log("object not able to fetch")
      }
      try{
        const response = await fetch("http://localhost:3000/api/getUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
            "user": "all",
          },
        });
        if(response.ok){
          const data = await response.json();
          setnoUser(data.length)
        }
      } catch{
        console.log("object not able to fetch")
      }
      try {
        const response = await fetch("http://localhost:3000/api/orderReq", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
            options: "all",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch order requests");
          return;
        }

        const data = await response.json();
        setRecentBookings(data.data); // Update with the correct structure
      } catch (error) {
        console.error("Error fetching order requests:", error);
      }
    };

    recentBookings.all_order.forEach(booking => {
      const matchingRentData = recentBookings?.rentData?.find(
        (rent) => rent._id === booking.productID
      );
      const matchingDealsData = recentBookings?.dealsData?.find(
        (deal) => deal._id === booking.productID
      );
      if(booking.money_status === "Paid"){
        
      if(matchingDealsData ){
        Revnue+=parseInt(matchingDealsData?.price, 10);
      }else{
        Revnue+= parseInt(matchingRentData?.fare, 10);
      }  
      }
    });
    console.log("Revnue",Revnue)
    setrev(Revnue)
    fetchRequests();
  }, [recentBookings]); // Only fetch once, no dependency on `recentBookings`

  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query whenever it changes
  };
  const filteredBookings =
    recentBookings.all_order?.filter((booking) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        booking._id?.toLowerCase().includes(searchTerm) ||
        booking.StartDate?.toLowerCase().includes(searchTerm) ||
        booking.Status?.toLowerCase().includes(searchTerm) ||
        booking.money_status?.toLowerCase().includes(searchTerm) ||
        booking.EndDate?.toLowerCase().includes(searchTerm) ||
        booking.productID
      );
    }) || []; 
  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
          <div className={styles.dashboardContent}>
            {/* Dashboard Metrics Section */}
            <div className={styles.metricsSection}>
              <div className={styles.metricCard}>
                <h2>Total Revenue</h2>
                <p className={styles.count}>{rev} pkr</p>
              </div>
              <div className={styles.metricCard}>
                <h2>Total Clients</h2>
                <p className={styles.count}>{NOofUser}</p>
              </div>
              <div className={styles.metricCard}>
                <h2>Total Car List</h2>
                <p className={styles.count}>{NoCars}</p>
              </div>
            </div>

            {/* User Engagement Section */}
            <div className={styles.engagementSection}>
              <div className={`${styles.engagementCard} ${styles.email}`}>
                📧 50% Email
              </div>
              <div className={`${styles.engagementCard} ${styles.facebook}`}>
                📘 20% Facebook
              </div>
              <div className={`${styles.engagementCard} ${styles.linkedin}`}>
                🔗 10% LinkedIn
              </div>
              <div className={`${styles.engagementCard} ${styles.gmail}`}>
                📨 10% Gmail
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className={styles.bookingsTable}>
              <h2>Recent Car Bookings</h2>
              <table>
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Amount </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const matchingRentData = recentBookings?.rentData?.find(
                      (rent) => rent._id === booking.productID
                    );
                    const matchingDealsData = recentBookings?.dealsData?.find(
                      (deal) => deal._id === booking.productID
                    );
                    return (
                      <tr key={booking._id}>
                        <td>{booking._id}</td>
                        <td>
                          {matchingRentData?.car_name ||
                            matchingDealsData?.title ||
                            "N/A"}
                        </td>
                        <td
                          className={
                            booking.money_status === "Paid"
                              ? styles.statusDone
                              : styles.statusProgress
                          }
                        >
                          {booking.money_status}
                        </td>
                        <td>
                          {new Date(booking.StartDate)
                            .toISOString()
                            .substring(0, 10)}
                        </td>
                        <td>
                          {new Date(booking.EndDate)
                            .toISOString()
                            .substring(0, 10)}
                        </td>
                        <td>
                          {matchingDealsData?.price ||
                            matchingRentData?.fare ||
                            "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Admin":
        return <AdminPage searchQuery={searchQuery} />;
      case "Clients":
        return <Clients searchQuery={searchQuery} />;
      case "AllCars":
        return <AllCars searchQuery={searchQuery} />;
      case "History":
        return <History searchQuery={searchQuery} />;
      case "PendingPayments":
        return <PendingPayment searchQuery={searchQuery} />;
      default:
        return (
          <div>
            <h2>404 - Not Found</h2>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className={styles.main}>
        <TopNav searchQuery={searchQuery} onSearch={handleSearch} />
        <div className={styles.content}>{renderActiveComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
