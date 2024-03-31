// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Keep your global styles
import App from './App';
import { Provider } from 'react-redux'; // Import the Provider component
import store from './state/store/index'; // Import your Redux store. Adjust the path according to your project structure.

// If you're not using reportWebVitals, you can remove or comment out its import and usage
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}> {/* Wrap your App component with the Provider and pass the store as a prop */}

            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you're not using reportWebVitals, you can remove or comment out its call
// reportWebVitals();
