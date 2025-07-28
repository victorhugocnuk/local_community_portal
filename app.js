// app.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Define the port, 5000 is default for the assessment

// Set EJS as the view engine
// Technical Explanation: This line configures Express to use EJS for rendering HTML templates.
app.set('view engine', 'ejs');
// Technical Explanation: This tells Express where to find your EJS template files.
// `path.join(__dirname, 'views')` constructs an absolute path to the 'views' folder
// located in the same directory as this `app.js` file.
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files (CSS, JS, images, etc.) from the 'public' directory
// Technical Explanation: `express.static()` is a built-in middleware function.
// When a browser requests a file like '/css/style.css', Express will look for it
// inside the 'public' folder.
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON request bodies
// Technical Explanation: `express.json()` parses incoming requests with JSON payloads.
// This is essential for handling AJAX POST requests where data is sent as JSON.
app.use(express.json());
// Middleware to parse URL-encoded request bodies
// Technical Explanation: `express.urlencoded({ extended: true })` parses incoming requests
// with URL-encoded payloads, typically from HTML forms. `extended: true` allows for rich objects and arrays.
app.use(express.urlencoded({ extended: true }));

// Home page route - Renders the 'index.ejs' file
// Technical Explanation: This defines a GET request handler for the root URL ('/').
// When a user accesses http://localhost:5000/, this function will be executed.
// `res.render('index', { pageTitle: '...' })` tells Express to render the 'index.ejs' template
// and pass a `pageTitle` variable to it, which EJS can then use.
app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Welcome to Local Community Portal' });
});

// Contact page route
app.get('/contact', (req, res) => {
    res.render('contact', { pageTitle: 'Contact Us' });
});

// Start the server
// Technical Explanation: `app.listen()` starts the Express server on the specified PORT.
// The callback function is executed once the server successfully starts.
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// FAQ page route
app.get('/faq', (req, res) => {
    res.render('faq', { pageTitle: 'Frequently Asked Questions' });
});