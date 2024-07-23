import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: "",
    contact: "",
    profilePicture: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/registerApi/register",
        formData
      );
      // alert("Registration sucessfull")
      if (response.data.length != 0) {
        // navigate("/login");
        alert("Registration successful");
      } else {
        console.log("User Not Found");
      }
      console.log("Registration sucessful", response.data);
    } catch (error) {
      console.error("There was an error registering!", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div>
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
                  type="submit"
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
      </div>
    </>
  );
};

export default RegistrationForm;
