import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React from "react";

import { apiAdmin } from "../../api/api";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaHistory } from "react-icons/fa";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { LinkContainer } from "react-router-bootstrap";

import SearchBox from "./SearchBox";
import Cookies from "js-cookie";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const name = Cookies.get("name");
  const isAccessAdmin = Cookies.get("isAccessAdmin");

  const cartItems = useSelector((state) => state.cartItems);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const toAdminPage = () => {
    window.open(apiAdmin);
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>ProShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/shop">
                <Nav.Link>
                  <RiShoppingBag3Fill /> Shop
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                    {cartItems}
                  </Badge>
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/history">
                <Nav.Link>
                  <FaHistory /> History
                </Nav.Link>
              </LinkContainer>
              {token ? (
                <>
                  <NavDropdown title={name} id="username">
                    <LinkContainer to="/auth/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/auth/changePassword">
                      <NavDropdown.Item>Change password</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/like">
                      <NavDropdown.Item>Favourite</NavDropdown.Item>
                    </LinkContainer>

                    {isAccessAdmin && (
                      <NavDropdown.Item onClick={toAdminPage}>
                        Admin Dashboard
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/auth">
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
