import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import FlashMessage from "react-flash-message";
import "../components/LoginForm.css";
//  import { useSearchParams } from 'react-router-dom';

export default function SignupForm() {
  const queryParameters = new URLSearchParams(window.location.search);
  const email = queryParameters.get("email");
  console.log(email, "EMAIL");

  let message = localStorage.getItem("msg");

  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("msg");
    }, 3000);
  }, []);

  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data,email, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:4000/auth/setNewPassword";
      const response = await axios.post(url, data);
      alert(response.data.msg);
        navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.msg);
      }
    }
  };

  return (
    <Container className="login">
      <div className="col-md-4 mx-auto my-5">
        <div className="formContainer">
          {message && (
            <FlashMessage duration={3000}>
              <Alert variant="success">
                <strong>{message}</strong>
              </Alert>
            </FlashMessage>
          )}
          <h1>Create new Password</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="confirmPassword"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                value={data.confirmPassword}
                required
              />
            </Form.Group>

            {error && (
              <div className="formError">
                <Alert className="alert" variant="danger">
                  <strong>{error}</strong>
                </Alert>
              </div>
            )}
            <Button variant="dark" size="sm" type="submit">
              Send Reset Password Link
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
}
