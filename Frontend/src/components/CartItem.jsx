import React from "react";
import {
  MDBBtn,
  MDBCardImage,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,

} from "mdb-react-ui-kit";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


export default function CartItem(item) {
  console.log(item,"PP")
  var image = `http://localhost:4000/images/${item.product.imageUrl}`;
  return (
    <>
      <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
        <MDBCol md="2" lg="2" xl="2">
          <MDBCardImage
            src={image}
            fluid
            className="rounded-3"
            alt="Cotton T-shirt"
          />
        </MDBCol>
        <MDBCol md="3" lg="3" xl="3">
          <MDBTypography tag="h6" className="text-muted">
            {item.product.category}
          </MDBTypography>
          <MDBTypography tag="h6" className="text-black mb-0">
            {item.product.name}
          </MDBTypography>
          <MDBTypography tag="h8" className="text-black mb-0">
            Rs.{item.product.price}
          </MDBTypography>
        </MDBCol>
        <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
        <button color="link" className="btn btn-danger px-1 py-1">-
          {/* <FontAwesomeIcon icon="fa-sharp fa-solid fa-minus" /> */}
          </button>

          <MDBInput
            type="number"
            min="0"
            defaultValue={item.quantity}
            size="sm"
            style={{width: "50px"}}
          />
          <button color="link" className="btn btn-success px-1 py-1">+
          {/* <FontAwesomeIcon icon="fa-sharp fa-solid fa-plus" /> */}
          </button>
        </MDBCol>
        <MDBCol md="3" lg="2" xl="2" className="text-end">
          <MDBTypography tag="h6" className="mb-0">
            Item Total: Rs.{item.product.price*item.quantity}
          </MDBTypography>
        </MDBCol>
        <MDBCol md="1" lg="1" xl="1" className="text-end">
          <a href="#!" className="text-muted">
            <MDBIcon fas icon="times" />
          </a>
        </MDBCol>
      </MDBRow>
      <hr className="my-4" />
    </>
  );
}
