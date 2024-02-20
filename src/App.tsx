import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { NavLink, Outlet, useNavigate  } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ErrorAlert from './components/ErrorAlert';
import { getErrorMessage } from './utils/getErrorMessage';
import './App.scss';

function App() {
  const { isAuthorized, logout } = useAuth();
  const [logoutError, setLogoutError] = useState('');

  const navigate = useNavigate();

  const onLogout = async() => {
    setLogoutError('');

    try {
      await logout();
      navigate('/');
    } catch (error) {
      setLogoutError(getErrorMessage(error));
    }
  }

  return (
    <div className="App">
      <header>
        <Navbar expand="md" bg="primary" data-bs-theme="dark" sticky="top">
          <Container>
            <Navbar.Brand as={NavLink} to="/">
                React Auth App
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="navbar" />
            <Navbar.Collapse id="navbar">
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="profile">Profile</Nav.Link>
              </Nav>

              {isAuthorized && (
                <Button 
                  type="button" 
                  onClick={onLogout}
                  variant="outline-light"
                >
                  Log Out
                </Button>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {!!logoutError && (<ErrorAlert message={logoutError} />)}

      <main className='main'>
        <Container>
          <div className="center-container">
            <Outlet />
          </div>
        </Container>
      </main>
    </div>
  );
}

export default App;
