import React from "react";
import axios from "axios";
import "../pages/home.css";
import {
  Container,
  Pagination,
  Button,
  ButtonGroup,
  ToggleButton,
  Form,
  Alert,
} from "react-bootstrap";
import FlashMessage from "react-flash-message";
import Product from "../components/Product";
import { useEffect, useState } from "react";

export default function Home() {
  let message = localStorage.getItem("msg");

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState();
  const [radioValue, setRadioValue] = useState("1");

  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const radios = [
    { name: "All", value: "1" },
    { name: "Electronics", value: "2" },
    { name: "Shoes", value: "3" },
    { name: "Clothes", value: "4" },
    { name: "Corckery", value: "5" },
    { name: "Other", value: "6" },
  ];

  const updateCategory = async (cat) => {
    setPage(1);
    cat === "All" ? setCategory("") : setCategory(cat);
  };

  const fetchProducts = async () => {
    try {
      const url = `http://localhost:4000?category=${category}&name=${search}&page=${page}`;
      const products = await axios.get(url);
      var prod = products.data;
      setProducts(products.data);
      // console.log(products);
    } catch (error) {
      console.log(error);
    }
    const allCategories = [
      "all",
      ...new Set(prod.map((product) => product.category)),
    ];
    // console.log(allCategories,'CATEGORIES')
    allCategories.forEach((element) => {
      console.log(element, "ELEMENT");
    });
  };

  useEffect(() => {
    fetchProducts();
    setTimeout(() => {
      localStorage.removeItem("msg");
    }, 3000);
  }, [category, search, page]);

  return (
    <>
      {message && (
        <FlashMessage duration={3000}>
          <Alert variant="success">
            <strong>{message}</strong>
          </Alert>
        </FlashMessage>
      )}
      <Container className="catNav mt-5 mb-5">
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="outline-dark"
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => setRadioValue(e.currentTarget.value)}
              onClick={() => updateCategory(radio.name)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Container>
      <Container className="searchBar mt-3 mb-3">
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search Product"
            onChange={handleChange}
            value={search}
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-dark">Search</Button>
        </Form>
      </Container>

      <Container className="mt-5">
        <div className="row">
          {products.map((product) => {
            return (
              <div className="col-md-3 mb-4">
                <Product key={product._id} {...product} />
              </div>
            );
          })}
        </div>
        <Pagination varient="dark">
          <Pagination.Prev
            onClick={() => {
              let prev = page - 1;
              setPage(prev);
            }}
          />
          <Pagination.Item onClick={() => setPage(1)}>{1}</Pagination.Item>
          <Pagination.Item onClick={() => setPage(2)}>{2}</Pagination.Item>
          <Pagination.Item onClick={() => setPage(3)}>{3}</Pagination.Item>
          <Pagination.Item onClick={() => setPage(4)}>{4}</Pagination.Item>
          <Pagination.Next
            onClick={() => {
              let nxt = page + 1;
              setPage(nxt);
            }}
          />
        </Pagination>
      </Container>
    </>
  );
}
