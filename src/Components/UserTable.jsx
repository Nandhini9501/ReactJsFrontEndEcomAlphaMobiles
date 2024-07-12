import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import axios from "axios";
import editImg from "../assets/Image/edit-icon.svg";
import viewImg from "../assets/Image/view.png";
import deleteImg from "../assets/Image/delete.svg";
import saveImg from "../assets/Image/save.png";
import closeImg from "../assets/Image/close.svg";
import AdminNav from "./AdminNav";
// import Image from "react-bootstrap";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Corrected state name
  const [userToDelete, setUserToDelete] = useState(null); // Corrected variable name
  const [currentUser, setCurrentUser] = useState({
    id: "",
    userName: "",
    password: "",
    email: "",
    contact: "",
    image: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4040/registerApi/getData"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleShowEdit = (user) => {
    setCurrentUser(user);
    setShowEdit(true);
  };

  const handleShowView = (user) => {
    console.log("USER+++++++++", user);
    console.log(user.image);
    setCurrentUser(user);
    setShowView(true);
  };

  const handleCloseEdit = () => setShowEdit(false);
  const handleCloseView = () => setShowView(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      let imageUrl = currentUser.image;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const userData = {
        ...currentUser,
        image: imageUrl,
      };

      if (currentUser.id) {
        await axios.post(
          `http://localhost:4040/registerApi/edit/${currentUser.id}`,
          userData
        );
      } else {
        await axios.post(
          "http://localhost:4040/registerApi/register",
          userData
        );
      }

      setShowEdit(false);
      fetchUsers();
    } catch (error) {
      console.log("Error saving user", error);
    }
  };

  const handleShowDeleteConfirm = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true); // Corrected function name
  };

  const handleDelete = async () => {
    try {
      await axios.get(
        `http://localhost:4040/registerApi/delete/${userToDelete.id}`
      );
      fetchUsers();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:4040/registerApi/uploadimg",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image Uploaded");
      return res.data;
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  };

  // Add User

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    userName: "",
    password: "",
    email: "",
    contact: "",
    image: null,
  });

  const handleShowAddUser = () => {
    setNewUser({
      userName: "",
      password: "",
      email: "",
      contact: "",
      image: null,
    });
    setShowAddUser(true);
  };

  const handleCloseAddUser = () => setShowAddUser(false);

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUserFileChange = (e) => {
    setNewUser({ ...newUser, image: e.target.files[0] });
  };

  const handleSaveNewUser = async () => {
    try {
      let imageUrl = "";

      if (newUser.image) {
        imageUrl = await uploadImage(newUser.image);
      }

      const userData = {
        ...newUser,
        image: imageUrl,
      };

      await axios.post("http://localhost:4040/registerApi/register", userData);

      setShowAddUser(false);
      fetchUsers();
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  const handleCloseDeleteConfirm = () => setShowDeleteConfirm(false); // Corrected function name

  return (
    <>
      <AdminNav />

      <Button
        variant="dark"
        size="sm"
        onClick={handleShowAddUser}
        style={{ margin: "2%", marginLeft: "7%" }}
      >
        Add User
      </Button>

      <div>
        <Table striped bordered hover className="container">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">User Name</th>
              <th className="text-center">Password</th>
              <th className="text-center">Email</th>
              <th className="text-center">Contact</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td scope="row">{index + 1}</td>
                <td className="text-center">{user.userName}</td>
                <td className="text-center">{user.password}</td>
                <td className="text-center">{user.email}</td>
                <td className="text-center">{user.contact}</td>
                <td className="text-center">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleShowEdit(user)}
                  >
                    <img
                      src={editImg}
                      alt="Edit"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>{" "}
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleShowView(user)}
                  >
                    <img
                      src={viewImg}
                      alt="View"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleShowDeleteConfirm(user)}
                  >
                    <img
                      src={deleteImg}
                      alt="Delete"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Edit */}

        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentUser.id ? "Edit User" : "Add User"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUserName">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={currentUser.userName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  name="password"
                  value={currentUser.password}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formContact" className="mt-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={currentUser.contact}
                  onChange={handleChange}
                />
              </Form.Group>
              <div>
                <br />
                <label>Profile Picture</label>
                <br />
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ marginLeft: "30%" }}
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              <img
                src={closeImg}
                alt="Close"
                style={{ width: "20px", height: "20px" }}
              />
            </Button>
            <Button variant="secondary" onClick={handleSave}>
              <img
                src={saveImg}
                alt="Save"
                style={{ width: "20px", height: "20px" }}
              />
            </Button>
          </Modal.Footer>
        </Modal>

        {/* View  */}

        <Modal show={showView} onHide={handleCloseView}>
          <Modal.Header closeButton>
            <Modal.Title>View User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUserName">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={currentUser.userName}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  name="password"
                  value={currentUser.password}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={currentUser.email}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formContact" className="mt-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={currentUser.contact}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formProfilePicture" className="mt-3">
                <Form.Label>Profile Picture</Form.Label>
                <br />
                <img
                  src={`http://localhost:4040/images/${currentUser.image}`}
                  alt={currentUser.image}
                  style={{ width: "50%", height: "auto" }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseView}>
              <img
                src={closeImg}
                alt="Close"
                style={{ width: "20px", height: "20px" }}
              />
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation */}

        <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the User? {userToDelete?.userName}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add User */}

        <Modal show={showAddUser} onHide={handleCloseAddUser}>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formUserName">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={newUser.userName}
                  onChange={handleAddUserChange}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  name="password"
                  value={newUser.password}
                  onChange={handleAddUserChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleAddUserChange}
                />
              </Form.Group>
              <Form.Group controlId="formContact" className="mt-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={newUser.contact}
                  onChange={handleAddUserChange}
                />
              </Form.Group>
              <div>
                <br />
                <label>Profile Picture</label>
                <br />
                <input
                  type="file"
                  onChange={handleAddUserFileChange}
                  style={{ marginLeft: "30%" }}
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddUser}>
              <img
                src={closeImg}
                alt="Close"
                style={{ width: "20px", height: "20px" }}
              />
            </Button>
            <Button variant="secondary" onClick={handleSaveNewUser}>
              <img
                src={saveImg}
                alt="Save"
                style={{ width: "20px", height: "20px" }}
              />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default UserTable;
