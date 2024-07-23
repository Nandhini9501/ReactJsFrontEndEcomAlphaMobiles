import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Form, Dropdown, Modal } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import addCart from "../assets/Image/addCart.png";

export const NavBar = () => {
  const [showRegModal, setShowRegModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    id: "",
    password: "",
    email: "",
    contact: "",
  });

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("userName");
    const userId = localStorage.getItem("id");
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4040/registerApi/register",
        formData
      );
      if (response.data.length !== 0) {
        setShowRegModal(false);
        setShowLoginModal(true);
        alert("Registration successful");
      } else {
        console.log("User Not Found");
      }
    } catch (error) {
      console.error("There was an error registering!", error);
    }
  };

  const handleLogin = () => {
    setShowRegModal(false);
    setShowLoginModal(true);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleShow = () => setShowRegModal(true);
  const handleClose = () => setShowRegModal(false);

  const handleShowLogin = () => setShowLoginModal(true);
  const handleCloseLogin = () => setShowLoginModal(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4040/registerApi/login",
        login
      );
      console.log("Login response:", res.data);
      if (res.data.length !== 0) {
        alert("Login successful");
        setShowLoginModal(false);

        localStorage.setItem("userName", res.data.userName);
        localStorage.setItem("userId", res.data.id);
        localStorage.setItem("isAdmin", res.data.admin);

        setLoggedInUser(res.data.userName);

        if (res.data.admin) {
          setShowRoleModal(true);
        } else {
          navigate("/");
        }
      } else {
        console.log("User Not Found");
      }
    } catch (error) {
      console.log("Error Occurred", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    setLoggedInUser(null);
    navigate("/");
  };

  const handleRoleSelection = (role) => {
    setShowRoleModal(false);
    if (role === "admin") {
      navigate("/user");
    } else {
      navigate("/");
    }
  };

  const handleNavigate = () => {
    navigate("/addCart");
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand
          style={{
            marginLeft: "10px",
            fontFamily: "cursive",
            fontSize: "30px",
          }}
          href="/"
        >
          Alpha Mobiles
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            {loggedInUser && <Nav.Link href="/productPage">Products</Nav.Link>}
            {loggedInUser ? (
              <>
                <Dropdown>
                  <Dropdown.Toggle variant="dark">
                    {loggedInUser}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="dark" onClick={handleNavigate}>
                  <img
                    src={addCart}
                    style={{ width: "30px", height: "30px" }}
                  />
                </Button>
              </>
            ) : (
              <>
                <Button variant="dark" onClick={handleShow}>
                  Sign In
                </Button>
                <Button variant="dark" onClick={handleShowLogin}>
                  Login
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Registration Modal */}
      <Modal show={showRegModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="container">
              <Form.Group>
                <Form.Label className="textuser">User name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter user name"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                />
                <Form.Label className="textuser">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Form.Label className="textuser">Mobile No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Mobile"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
                <Form.Label className="textuser">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="buttonlogin">
                  <Button
                    style={{ marginLeft: "50px", marginTop: "30px" }}
                    className="button1"
                    type="submit"
                    variant="primary"
                    size="sm"
                    onClick={handleSubmit}
                  >
                    Sign in
                  </Button>
                  <Button
                    style={{ marginTop: "30px", marginLeft: "10px" }}
                    className="button1"
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </div>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body">
            <div>
              <Form className="container">
                <div className="text">Login</div>
                <Form.Group className="email" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={login.email}
                    onChange={handleLoginChange}
                  />
                </Form.Group>
                <Form.Group className="password" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={login.password}
                    onChange={handleLoginChange}
                  />
                </Form.Group>
                <div className="buttonlogin">
                  <Button
                    style={{ marginLeft: "200px", marginTop: "30px" }}
                    className="button1"
                    type="submit"
                    variant="primary"
                    onClick={handleLoginSubmit}
                  >
                    Log in
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Role Modal */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Role Selection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to log in as an admin or a user?</p>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              variant="primary"
              onClick={() => handleRoleSelection("admin")}
            >
              Admin
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleRoleSelection("user")}
            >
              User
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavBar;
