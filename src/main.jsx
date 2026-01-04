import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Chatbot from './pages/chat bot/chatbot.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Chatbot />
  </StrictMode>,
)
