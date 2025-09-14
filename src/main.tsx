import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("[CRITICAL] #root not found in index.html");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
    console.log("[DEBUG] React successfully mounted <App /> into #root");
  } catch (err) {
    console.error("[CRITICAL] Failed to render App:", err);
    rootElement.innerHTML = `<pre style="color:red;">Render failed: ${err}</pre>`;
  }
}
