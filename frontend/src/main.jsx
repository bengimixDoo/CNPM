import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import {adminClient} from 'react-admin'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode> 
)