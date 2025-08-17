import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'


console.log('Initial title:', document.title);

// Watch for title changes
const observer = new MutationObserver(() => {
  console.log('Title changed to:', document.title);
});

observer.observe(document.querySelector('title')!, {
  childList: true,
  subtree: true,
  characterData: true
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
