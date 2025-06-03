import { useRouter } from 'next/router';
import styles from "../styles/admindashboard.module.css";
import Image from 'next/image';
import logo00 from "../../public/images/logo20.png";

const Sidebar = ({ setActiveComponent }) => {
  return (
    <aside className={styles.sidebar}>
      <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'left',
            height: '150px',
            paddingRight: '10px',
            paddingTop: '10px',
            paddingLeft: '0px',
          }}
        >
          <Image
            src={logo00}
            alt="FlexiRide Logo"
            style={{
              // maxWidth: '100%',
              maxHeight: '100%',
              width: '160px',
              objectFit: 'contain',
              paddingRight: '10px',
              paddingTop: '10px',
              paddingLeft: '0px',
            }}
          />
        </div>
      <ul className={styles.navLinks}>
        <li onClick={() => setActiveComponent('Dashboard')}>Dashboard</li>
        <li onClick={() => setActiveComponent('Admin')}>Admin</li>
        <li onClick={() => setActiveComponent('Clients')}>Clients</li>
        <li onClick={() => setActiveComponent('AllCars')}>All Cars</li>
        <li onClick={() => setActiveComponent('History')}>History</li>
        <li onClick={() => setActiveComponent('PendingPayments')}>Pending Payments</li>
        
      </ul>
    </aside>
  );
};

export default Sidebar;
