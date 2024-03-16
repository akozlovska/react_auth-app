# React Accounting App

This is a client for Accounting web application built using React. It provides user authentication functionalities such as registration, login, logout and change of user data along with accounting features including managing expenses and categories.

## Features

- **Local Authentication**: Allows to register and login using email and password, implements authentication mechanisms to protect routes and access.
- **Third-party Authentication**: Enables authentication via social accounts (Google, Github).
- **User Profile Management**: Allows to change username, email a password, connect social accounts (Google, Github).
- **Expense Management**: Enables users to add, edit, and delete expenses, enables expenses filtering and sorting.
- **Category Management**: Allows users to organize expenses into different categories, add, edit and delete categories.

## Stack

- **React**: used here for creating the frontend components and managing the application's state.
- **React Router**: used to handle navigation and route protection in the application.
- **React Hook Form**: used here for form validation and handling user input.
- **React Bootstrap**: used here for styling the application components.
- **Axios**: used to handle HTTP requests.

## Getting Started

To run this application locally, follow these steps:

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Add the .env file with REACT_APP_API_URL variable to point to your backend server ([backend server repository](https://github.com/akozlovska/node_auth-app/tree/develop)).
4. Run the application using `npm start`.
