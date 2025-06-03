import React, { useState, useEffect } from "react";
import styles from "../../styles/clients.module.css";

// Modal Components
const EditModal = ({ client, onClose, onSave }) => {
  const [updatedClient, setUpdatedClient] = useState({ ...client });

  const handleChange = (field, value) => {
    setUpdatedClient((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/updataUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify(updatedClient),
      });

      const data = await response.json();
      if (response.ok) {
        onSave(updatedClient); // Pass updated client to parent component
        console.log("User updated successfully:", data);
      } else {
        console.error("Error updating user:", data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Edit Client</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label>
            User Name:
            <input
              type="text"
              defaultValue={client.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              defaultValue={client.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </label>
          <label>
            Phone No:
            <input
              type="text"
              defaultValue={client.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
            />
          </label>
          <div className={styles.modalActions}>
            <button type="submit" className={styles.saveBtn}>
              Save
            </button>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteModal = ({ client, onClose, onConfirm }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/updataUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "permission": "admin",
        },
        body: JSON.stringify({ userId: client._id }),
      });

      const data = await response.json();
      if (response.ok) {
        onConfirm(client); // Notify parent component about deletion
        console.log("User deleted successfully:", data);
      } else {
        console.error("Error deleting user:", data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Delete Confirmation</h2>
        <p>
          Are you sure you want to delete <strong>{client.name}</strong>?
        </p>
        <div className={styles.modalActions}>
          <button onClick={handleDelete} className={styles.deleteConfirmBtn}>
            Yes, Delete
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const Clients = ({ searchQuery }) => {
  const [carOwnersData, setCarOwnersData] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": `${localStorage.getItem("auth-token")}`,
            "user": "all",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setCarOwnersData(data);
          setFilteredOwners(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOwners(carOwnersData);
    } else {
      const filtered = carOwnersData.filter(
        (owner) =>
          owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          owner.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOwners(filtered);
    }
  }, [searchQuery, carOwnersData]);

  const handleEdit = (client) => {
    setSelectedClient(client);
    setModalType("edit");
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setModalType("delete");
  };

  const handleView = (client) => {
    setSelectedClient(client);
    setModalType("view");
  };

  const closeModal = () => {
    setSelectedClient(null);
    setModalType(null);
  };

  const saveClientChanges = (updatedClient) => {
    setCarOwnersData((prev) =>
      prev.map((owner) => (owner._id === updatedClient._id ? updatedClient : owner))
    );
  };

  const confirmDelete = (deletedClient) => {
    setCarOwnersData((prev) =>
      prev.filter((owner) => owner._id !== deletedClient._id)
    );
    closeModal();
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Email-ID</th>
            <th>Phone-No</th>
            <th>Role</th>
            <th>Image</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOwners.length > 0 ? (
            filteredOwners.map((owner) => (
              <tr key={owner._id}>
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>{owner.phone_number}</td>
                <td>{owner.UserType}</td>
                <td>
                  <img
                    src={owner.image}
                    alt="User"
                    className={styles.userImage}
                  />
                </td>
                <td>{owner.createdAt}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(owner)}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(owner)}
                    >
                      🗑️
                    </button>
                    <button
                      className={styles.viewBtn}
                      onClick={() => handleView(owner)}
                    >
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No results found</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalType === "edit" && selectedClient && (
        <EditModal
          client={selectedClient}
          onClose={closeModal}
          onSave={saveClientChanges}
        />
      )}
      {modalType === "delete" && selectedClient && (
        <DeleteModal
          client={selectedClient}
          onClose={closeModal}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Clients;
