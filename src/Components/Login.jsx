import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import NavBar from "./NavBar";

const Login = () => {
  const [login, getlogin] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    getlogin({ ...login, [name]: value });
    console.log(login);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/registerApi/login",
        login
      );
      console.log(res.data);
      if (res.data.length != 0) {
        navigate("/admin");
      } else {
        console.log("User Not Found");
      }
    } catch (error) {
      console.log("Error Occured", error);
    }
  };

  return (
    <>
      <div className="body">
        {/* <NavBar/> */}
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
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="password" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={login.password}
                onChange={handleChange}
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
    </>
  );
};

export default Login;
