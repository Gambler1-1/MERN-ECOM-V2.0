import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import '../components/SignupForm.css';
import FlashMessage from "react-flash-message";

export default function SignupForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    gender:"",
    confirmPassword: "",
    phoneNum:"",

  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  const handleSelect = (e) => {
    setData({ ...data, gender: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:4000/auth/post-signup";
      const response = await axios.post(url, data);
      console.log(response, "RESPONSE");
      // alert(response.data.msg);
      localStorage.setItem("msg", response.data.msg);
      navigate("/login");
    } catch (error) {
      // alert(error.response.data.msg);
      console.log(error.response.data.msg);
      setError(error.response.data.msg);
    }
  };

  return (
    <>
      <Container>
        <div className="col-md-4 mx-auto my-5">
          <h1>SIGN UP</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                name="name"
                onChange={handleChange}
                value={data.name}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                value={data.confirmPassword}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhoneNum1">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="phoneNum"
                placeholder="Enter contact number"
                name="phoneNum"
                onChange={handleChange}
                value={data.phoneNum}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select placeholder="Select Gender" type='gender' name='gender'  value={data.gender} onChange={handleSelect}>
                <option    value='not provided' >
                  Select Gender
                </option>
                <option value='Male' >Male</option>
                <option value='Female'>Female</option>
              </Form.Select>
            </Form.Group>
            {error && (
              <div className="formError">
                <Alert variant="danger">
                  <strong>{error}</strong>
                </Alert>
              </div>
            )}
            <Button className="mt-3" variant="dark" type="submit">
              Signup
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
}
