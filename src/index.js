// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import './index.css'; // Keep your global styles
import App from './App';
import { Provider } from 'react-redux'; // Import the Provider component
import store from './state/store/index'; // Import your Redux store. Adjust the path according to your project structure.

// If you're not using reportWebVitals, you can remove or comment out its import and usage
// import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Create a root.

root.render(
    <React.StrictMode>
        <Provider store={store}> {/* Wrap your App component with the Provider and pass the store as a prop */}
            <App />
        </Provider>
    </React.StrictMode>
);

// If you're not using reportWebVitals, you can remove or comment out its call
// reportWebVitals();
