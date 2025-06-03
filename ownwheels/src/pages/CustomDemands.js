import styles from "../styles/CustomDemands.module.css";

const CustomDemands = ({ customDemand, setCustomDemand, handleSubmitDemand }) => {
  return (
    <div className={styles.customDemands}>
      <h2>Customized Demands</h2>
      <textarea
        placeholder="Enter your requirements..."
        value={customDemand}
        onChange={(e) => setCustomDemand(e.target.value)}
        className={styles.textarea}
      />
      <button onClick={handleSubmitDemand} className={styles.button}>
        Submit Demand
      </button>
    </div>
  );
};

export default CustomDemands;
