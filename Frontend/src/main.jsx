import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { EmployeeContextProvider } from './context/EmployeeContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <EmployeeContextProvider>
        <App />
      </EmployeeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)

