import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoutes from './components/Routes/PrivateRoutes';
import { AuthProvider } from './context/AuthContext';
import PasswordResetPage from './pages/PasswordResetPage';
import SignInPage from './pages/SignInPage';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import EmailConfirmationPage from './pages/EmailConfirmationPage';
import { ExpenseProvider } from './context/ExpenseContext';
import NonAuthorizedRoutes from './components/Routes/NonAuthorizedRoutes';
import ExpensesPage from './pages/ExpensesPage';
import CategoriesPage from './pages/CategoriesPage';
import AuthCallback from './pages/AuthCallback';

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
        element: <NonAuthorizedRoutes />,
        children: [
          {
            path: "login",
            element: <SignInPage />,
          },

          {
            path: "register",
            element: <SignUpPage />,
          },

          {
            path: "reset-password/:email",
            element: <PasswordResetPage />,
          },

          {
            path: 'confirmation/:type',
            element: <EmailConfirmationPage />
          },

          {
            path: 'auth-callback',
            element: <AuthCallback />
          }
        ],
      },

      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "profile",
            element: <ProfilePage />,
            children: [
              {
                path: "expenses",
                element: <ExpensesPage />
              },

              {
                path: "categories",
                element: <CategoriesPage />
              },
            ],
          },
        ],
      },

      {
        path: '*',
        element: <NotFoundPage />
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ExpenseProvider>
        <RouterProvider router={router} />
      </ExpenseProvider>
    </AuthProvider>
  </React.StrictMode>
);
