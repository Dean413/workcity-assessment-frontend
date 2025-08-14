import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const NavbarComponent = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignout = () => {
    signout();
    navigate('/signin');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>projectLink</Navbar.Brand>

        {!user ? (
          <Nav className="ms-auto">
            {location.pathname !== '/signin' && (
              <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
            )}
            {location.pathname !== '/' && (
              <Nav.Link as={Link} to="/">Sign Up</Nav.Link>
            )}
          </Nav>
        ) : (
          <>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="me-auto">
                {user.role === 'admin' ? (
                  <>
                    <Nav.Link as={Link} to="/admin-dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/clients">Clients</Nav.Link>
                    <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/client-dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/client-profile">View Profile</Nav.Link>
                    <Nav.Link as={Link} to="/client-project">My Projects</Nav.Link>
                  </>
                )}
              </Nav>
              <Nav>
                <Button variant="outline-danger" onClick={handleSignout}>Sign Out</Button>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
