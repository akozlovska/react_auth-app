import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { NavLink, Outlet, useLocation, useNavigate  } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ErrorAlert from './components/ErrorAlert';
import { getErrorMessage } from './utils/getErrorMessage';
import './App.scss';
import { usePageError } from './hooks/usePageError';

function App() {
  const { isAuthorized, logout } = useAuth();
  const [logoutError, setLogoutError] = usePageError('');

  const navigate = useNavigate();
  const location = useLocation();

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
      <header className="position-sticky top-0 start-0 end-0 z-3">
        <Navbar expand="md" bg="primary" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={NavLink} to="/">
              Accounting App
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

        {location.pathname.startsWith('/profile') && (
          <Navbar expand="md" bg="primary-subtle" className="py-0">
            <Container>
              <Nav className="me-auto flex-row gap-3">
                <Nav.Link as={NavLink} to="profile/expenses">Expenses</Nav.Link>
                <Nav.Link as={NavLink} to="profile/categories">Categories</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
        )}
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
