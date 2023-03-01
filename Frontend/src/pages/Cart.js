import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import React from "react";
import "./Cart.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import CartItem from '../components/CartItem'

export default function QuantityEdit() {
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState([]);


  const [isLoading, setIsLoading] = useState(false);

  let user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  const fetchCart = async () => {
    try {
      const url = ` http://localhost:4000/cart?userId=${userId}`;
      const response = await axios.get(url);
      setCartItems(response.data.cartItems);
      setCart(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
    setTimeout(() => {
      localStorage.removeItem("msg");
    }, 3000);
  }, [])


  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol size="12">
            <MDBCard
              className="card-registration card-registration-2"
              style={{ borderRadius: "15px" }}
            >
              <MDBCardBody className="p-0">
                <MDBRow className="g-0">
                  <MDBCol lg="8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <MDBTypography
                          tag="h1"
                          className="fw-bold mb-0 text-black"
                        >
                          Shopping Cart
                        </MDBTypography>
                        <MDBTypography className="mb-0 text-muted">
                         {cartItems.length} Items
                        </MDBTypography>
                      </div>

                      <hr className="my-4" />


                      
                      { cartItems.map((item) => {
                        return (<>
                              <CartItem key={item._id} {...item} />

                        </>);
                      })} 

                 
                      

                      <div className="pt-5">
                        <MDBTypography tag="h6" className="mb-0">
                          <MDBCardText tag="a" href="#!" className="text-body">
                            <MDBIcon fas icon="long-arrow-alt-left me-2" /> Back
                            to shop
                          </MDBCardText>
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol lg="4" className="bg-grey">
                    <div className="p-5">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-5 mt-2 pt-1"
                      >
                        Summary
                      </MDBTypography>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-4">
                        <MDBTypography tag="h5" className="text-uppercase">
                          Total Items : {cartItems.length}
                        </MDBTypography>
                        <MDBTypography tag="h5">{cart.totalPrice}/-</MDBTypography>
                      </div>

                      <MDBTypography tag="h5" className="text-uppercase mb-3">
                        Shipping
                      </MDBTypography>

                      <div className="mb-4 pb-2">
                        <select
                          className="select p-2 rounded bg-grey"
                          style={{ width: "100%" }}
                        >
                          <option value="1">Standard-Delivery- €5.00</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                          <option value="4">Four</option>
                        </select>
                      </div>

                      <MDBTypography tag="h5" className="text-uppercase mb-3">
                        Give code
                      </MDBTypography>

                      <div className="mb-5">
                        <MDBInput size="lg" label="Enter your code" />
                      </div>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-5">
                        <MDBTypography tag="h5" className="text-uppercase">
                          Total price
                        </MDBTypography>
                        <MDBTypography tag="h5">Rs.{cart.totalPrice}</MDBTypography>
                      </div>

                      <Button variant="dark">BUY NOW</Button>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}



                      {/* {prod.map((item) => {
                        return <>
                              <CartItem key={item._id} {...item} />

                        </>;
                      })} */}