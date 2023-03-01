import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import FlashMessage from "react-flash-message";
 import '../components/LoginForm.css';


export default function SignupForm() {
  let message = localStorage.getItem("msg");

  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("msg");
    }, 3000);
  }, []);

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:4000/auth/sendResetPasswordLink";
      const response = await axios.post(url, data);
      // console.log(response, "RESPONSE");

    //   localStorage.setItem("msg", response.data.msg);
    //   const user = JSON.stringify(response.data.user)
    //   localStorage.setItem("user", user);
    //   localStorage.setItem("token", response.data.token);
      
    //   console.log(JSON.parse(localStorage.getItem('user')),"USER")
    //   navigate("/");
      alert(response.data.msg);    
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
          <h1>RESET PASSWORD</h1>

          <Form onSubmit={handleSubmit}>
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
