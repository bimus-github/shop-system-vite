import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <div className="footer">
      Made with ❤️ by{' '}
      <a className="bimus" href="mailto:bimus2022@gmail.com">
        BIMUS
      </a>
    </div>
  </React.StrictMode>
)
