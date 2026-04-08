import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { LogProvider } from './context/LogContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LogProvider>
        <App />
      </LogProvider>
    </AuthProvider>
  </StrictMode>,
)

