import React from "react";
import {Button , Card}  from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";

import '../components/Product.css';
import axios from 'axios'



export default function Product({
  name,
  _id,
  category,
  imageUrl,
  price,
  description,
}) {

  const navigate = useNavigate();

  let userId;
  const user =JSON.parse(localStorage.getItem('user'))
  !user ?userId = 'null' : userId=user._id
   
  const handleClick = async(e)=>{
    e.preventDefault();
    if(!user){
      navigate("/login")
    }
    try {
      const url = `http://localhost:4000/addToCart?id=${_id}&userId=${userId}`;
      const response = await axios.get(url);
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  let image = `http://localhost:4000/images/${imageUrl}`;
  return (
    <div>
      <Card className="product">
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Title>Rs.{price}</Card.Title>
        <Button onClick={handleClick} variant="dark">Add to Cart</Button>
      </Card.Body>
    </Card>
    </div>
  );
}
