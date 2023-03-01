import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "./Navbarr.css";

export default function Navbarr() {
  let auth = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = async () => {
    const url = "http://localhost:4000/auth/logout";
    const response = await axios.get(url);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.setItem("msg", response.data.msg);

    navigate("/");
    alert(response.data.msg);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">MarketMate</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />.
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              {/* <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link> */}

              {!auth && (
                <>
                  <Link to="/signup" className="btn btn-dark">
                    Signup
                  </Link>
                  <Link to="/login" className="btn btn-dark">
                    Login
                  </Link>
                </>
              )}
              {auth && (
                <>
                  <div>
                    <div className="num-of-order text-white">
                      <h6>666</h6>
                    </div>
                    <FontAwesomeIcon
                      onClick={()=>navigate("/cart")}
                      className="icon "
                      icon={faCartShopping}
                      size="xl"
                    ></FontAwesomeIcon>
                  </div>
                  <NavDropdown title={auth.name} id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.2">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Link onClick={logout}>Logout</Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
