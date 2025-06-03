import React, { useState ,useEffect} from "react";
import styles from "./allcars.module.css";
import Image from "next/image";  // Use Next.js Image component

const AllCars = ({ searchQuery }) => {
  const [cars,setCars] = useState([])
  const [deals,setdeals] = useState([])
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const [editedCar, setEditedCar] = useState({
    reg_plate: "",
    car_make: "",
    Color: "",
    transmission: "",
  });
  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("auth-token");
      try {
        const response = await fetch("http://localhost:3000/api/orderReq", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
            "options": "all_cars",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch order requests");
          return;
        }

        const data = await response.json();
        console.log("data" ,data.data)
        setCars(data.data.rentData); // Update with the correct structure
        setdeals(data.data.dealsData)
      } catch (error) {
        console.error("Error fetching order requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const openModal = (car) => {
    setSelectedCar(car);
    setEditedCar({
      carNo: car.carNo,  // Pre-fill the carNo
      model: car.model,
      color: car.color,
      transmission: car.transmission,
      images: car.images,
    });
    setCurrentImageIndex(0);  // Reset the image index when opening the modal
  };

  const closeModal = () => setSelectedCar(null);
  const closeEditModal = () => setIsEditModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = (car) => {
    setCarToDelete(car);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async() => {
    try{
      const response = await fetch(`http://localhost:3000/api/delallCars?_id=${carToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('auth-token'),
        },
      });
      if(response.ok){
        const data = await response.json();
        console.log(data)
      }
    } catch{
      console.log("object not able to fetch")
    }
    setIsDeleteModalOpen(false);
    // Add delete logic here
  };

  const handleNextImage = () => {
    if (currentImageIndex < selectedCar.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCar({
      ...editedCar,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Here you would update the car details in your data source
    setSelectedCar({
      ...selectedCar,
      ...editedCar,
    });
    setIsEditModalOpen(false);
  };

  // Filter cars based on search query
  const filteredCars = cars.filter((car) => {
    return (
      car.car_make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.reg_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.Color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.transmission.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.car_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.images// Added car number to filter
    );
  });
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Registered Cars</h2>
      <div className={styles.cardGrid}>
        {filteredCars.map((car) => (
          <div className={styles.card} key={car._id}>
            <Image
              src={car.images[0].img1} // Display the first image initially
              alt={car.car_name}
              width={500}
              height={300}
              className={styles.carImage}
            />
            <h3>{car.car_name}</h3>
            <p>Car No: {car.reg_plate}</p>
            <div className={styles.buttonContainer}>
              <button className={styles.deleteBtn} onClick={() => handleDelete(car)}>
                🗑️
              </button>
              <button className={styles.viewDetailsBtn} onClick={() => openModal(car)}>
                👁️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Car Details Modal */}
      {selectedCar && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedCar.model}</h2>
            <p><strong>Car No:</strong> {selectedCar.reg_plate}</p>
            <p><strong>Owner:</strong> {selectedCar.UserName}</p>
            <p><strong>Color:</strong> {selectedCar.Color}</p>
            <p><strong>Transmission:</strong> {selectedCar.transmission}</p>


            <div className={styles.imageCarousel}>
              <button onClick={handlePreviousImage} className={styles.arrowBtn}>❮</button>
              <Image
                src={selectedCar.images[0].img1}
                alt={`Image of ${selectedCar.car_make}`}
                width={400}
                height={250}
                className={styles.modalImage}
              />
              <button onClick={handleNextImage} className={styles.arrowBtn}>❯</button>
            </div>

            <button className={styles.closeBtn} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Car Details</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Car No:
                <input
                  type="text"
                  name="reg_plate"
                  value={editedCar.reg_plate}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <label>
                Car Model:
                <input
                  type="text"
                  name="car_make"
                  value={editedCar.car_make}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <label>
                Color:
                <input
                  type="text"
                  name="Color"
                  value={editedCar.Color}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <label>
                Transmission:
                <input
                  type="text"
                  name="transmission"
                  value={editedCar.transmission}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              

              <button type="button" onClick={handleSave} className={styles.saveBtn}>
                Save Changes
              </button>
            </form>
            <button className={styles.closeBtn} onClick={closeEditModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Are you sure you want to delete {carToDelete?._id}?</h2>
            <button onClick={confirmDelete} className={styles.confirmDeleteBtn}>
              Yes, Delete
            </button>
            <button onClick={closeDeleteModal} className={styles.cancelBtn}>
              No, Cancel
            </button>
          </div>
        </div>
      )}
      <div className={styles.cardGrid}>
        {deals.map((car) => (
          <div className={styles.card} key={car._id}>
            <Image
              src={car.images[0].img1} // Display the first image initially
              alt={car.title}
              width={500}
              height={300}
              className={styles.carImage}
            />
            <h3>{car.title}</h3>
            <p>Description: {car.desc}</p>
            <div className={styles.buttonContainer}>
              <button className={styles.deleteBtn} onClick={() => handleDelete(car)}>
                🗑️
              </button>
              <button className={styles.viewDetailsBtn} onClick={() => openModal(car)}>
                👁️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Car Details Modal */}
      {selectedCar && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{selectedCar.title}</h2>
            <p><strong>Package Description:</strong> {selectedCar.desc}</p>
            <p><strong>Owner:</strong> {selectedCar.UserName}</p>
            <p><strong>Package Type:</strong> {selectedCar.type_deal}</p>
            <p><strong>Driver:</strong> {selectedCar.driver?"Driver":"Without Driver"}</p>


            <div className={styles.imageCarousel}>
              <button onClick={handlePreviousImage} className={styles.arrowBtn}>❮</button>
              <Image
                src={selectedCar.images[0].img1}
                alt={`Image of ${selectedCar.title}`}
                width={400}
                height={250}
                className={styles.modalImage}
              />
              <button onClick={handleNextImage} className={styles.arrowBtn}>❯</button>
            </div>

            <button className={styles.closeBtn} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Car Details</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Title:
                <input
                  type="text"
                  name="reg_plate"
                  value={editedCar.reg_plate}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="car_make"
                  value={editedCar.car_make}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <label>
                Package Type:
                <input
                  type="text"
                  name="Color"
                  value={editedCar.Color}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              <label>
                Special Instruction:
                <input
                  type="text"
                  name="transmission"
                  value={editedCar.transmission}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
              

              <button type="button" onClick={handleSave} className={styles.saveBtn}>
                Save Changes
              </button>
            </form>
            <button className={styles.closeBtn} onClick={closeEditModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Are you sure you want to delete {carToDelete?._id}?</h2>
            <button onClick={confirmDelete} className={styles.confirmDeleteBtn}>
              Yes, Delete
            </button>
            <button onClick={closeDeleteModal} className={styles.cancelBtn}>
              No, Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCars;
