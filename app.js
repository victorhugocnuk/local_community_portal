// app.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Define the port, 5000 is default for the assessment



const mongoose = require('mongoose'); // Import of Mongoose


mongoose.connect('mongodb://localhost:27017/community_portal_db')
    .then(() => console.log('Connected to MongoDB')) // Message displayed if the connection is successful
    .catch(err => console.error('Could not connect to MongoDB:', err)); // Error message if the connection fails

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

// Route to handle adding new news posts
// Technical Explanation: This defines a POST request handler for the '/news' URL.
// When a form submits data to this endpoint, the data (title, content)
// will be available in `req.body`. We then create a new NewsPost instance
// and save it to the database. Error handling is included.
app.post('/news', async (req, res) => {
    try {
        const { title, content } = req.body; // Extract title and content from the request body
        const newPost = new NewsPost({ title, content }); // Create a new NewsPost instance
        await newPost.save(); // Save the new post to the database
        res.status(201).send('News post created successfully!'); // Send a success response
    } catch (err) {
        console.error('Error creating news post:', err);
        res.status(400).send('Error creating news post: ' + err.message); // Send an error response
    }
});


// Adicione este código abaixo da sua rota POST /news

// Rota GET para buscar todos os posts de notícia
app.get('/news', async (req, res) => {
    try {
        const newsPosts = await NewsPost.find();
        res.json(newsPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news posts', error: error.message });
    }
});


// Adicione este código abaixo das suas rotas GET e POST /news

// Rota DELETE para excluir um post de notícia pelo ID
app.delete('/news/:id', async (req, res) => {
    try {
        const deletedPost = await NewsPost.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'News post not found' });
        }
        res.json({ message: 'News post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news post', error: error.message });
    }
});


// Rota PUT for a news post by ID
app.put('/news/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedPost = await NewsPost.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true } // return the updated document
        ); // <-- This parenthesis was missing

        if (!updatedPost) {
            return res.status(404).json({ message: 'News post not found' });
        }

        res.json({ message: 'News post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating news post', error: error.message });
    }
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

const NewsPost = require('./models/NewsPost');