import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoutes from './components/PrivateRoutes';
import { AuthProvider } from './context/AuthContext';
import PasswordResetPage from './pages/PasswordResetPage';
import SignInPage from './pages/SignInPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    
      {
        path: "login",
        element: <SignInPage />,
      },
    
      {
        path: "register",
        element: <SignUpPage />,
      },

      {
        path: "reset-password",
        element: <PasswordResetPage />,
      },

      {
        path: 'confirmation/:type',
        element: <EmailConfirmationPage />
      },
    
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },

      {
        path: '*',
        element: <NotFoundPage />
      }
    ],
  },
]);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
