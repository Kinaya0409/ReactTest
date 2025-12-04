// src/components/TopNavbar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";

import logo from "../assets/images/logo.png"; // Pastikan path benar
import "./TopNavbar.css";

const TopNavbar = ({ routes }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar di login/register
  if (["/login", "/register"].includes(location.pathname)) return null;

  const role = localStorage.getItem("role");

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const userName =
    user?.nama ||
    user?.username ||
    (role === "admin" ? "Admin" : "Pelanggan");

  const[showConfirm, setShowConfirm] = useState(false);
  const handleLogoutClick = () => setShowConfirm(true);


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Navbar fixed="top" expand="lg" className="custom-navbar shadow-sm">
      <Container>

        {/* LOGO + BRAND */}
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => navigate(role === "admin" ? "/admin/dashboard" : "/home")}
        >
          <div className="d-flex align-items-center">
            <img src={logo} alt="logo" className="nav-logo" />

            <div className="ms-2">
              <div className="fw-bold" style={{ fontSize: "18px" }}>
                Aurora Salon
              </div>
              <div className="small text-muted">Beauty & Care</div>
            </div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto align-items-center">

            {/* NAVIGATION BUTTONS */}
            {routes?.map((route, idx) => (
              <Nav.Link key={idx} className="me-2">
                <Button
                  className={`nav-btn ${
                    location.pathname === route.path ? "active" : ""
                  }`}
                  onClick={() => navigate(route.path)}
                >
                  {route.name}
                </Button>
              </Nav.Link>
            ))}

            {/* USER + LOGOUT */}
            {role ? (
              <>
                <span className="fw-semibold me-3">Hai, {userName}</span>
                <Button variant="danger" className="logout-btn" onClick={handleLogoutClick}>
                  Logout
                </Button>

                <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi Logout</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Apakah Anda yakin ingin logout?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                      Batal
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate("/login")}>
                  <Button className="nav-btn">Login</Button>
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/register")}>
                  <Button className="nav-btn active">Daftar</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
