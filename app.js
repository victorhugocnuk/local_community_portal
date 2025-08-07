// app.js

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); // Imports method-override middleware for PUT and DELETE

const app = express();
const PORT = process.env.PORT || 5000;

// Import the NewsPost model
const NewsPost = require('./models/NewsPost');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/community_portal_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Configure EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // IMPORTANT: Place this middleware here, after the body parsers!

// =======================
// Navigation and Static Pages Routes
// =======================
app.get('/', (req, res) => {
    res.render('index', { 
        pageTitle: 'Welcome to Local Community Portal',
        newsPosts: [] // Passa uma lista vazia de notícias para evitar erros na renderização do EJS
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { pageTitle: 'Contact Us' });
});

app.get('/faq', (req, res) => {
    res.render('faq', { pageTitle: 'Frequently Asked Questions' });
});

// =======================
// CRUD Routes for News Posts
// =======================

// GET route to display the list of news posts (READ)
app.get('/news', async (req, res) => {
    try {
        const newsPosts = await NewsPost.find();
        res.render('index', { 
            newsPosts: newsPosts,
            pageTitle: 'Community News' 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news posts', error: error.message });
    }
});

// GET route to display the creation form (CREATE)
app.get('/news/create', (req, res) => {
    res.render('create', { pageTitle: 'Create New Post' });
});

// GET route to display the edit form (UPDATE)
app.get('/news/edit/:id', async (req, res) => {
    try {
        const post = await NewsPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'News post not found' });
        }
        res.render('edit', { post: post, pageTitle: 'Edit Post' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news post', error: error.message });
    }
});

// POST route to create a new news post (CREATE)
app.post('/news', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new NewsPost({ title, content });
        await newPost.save();
        res.redirect('/news');
    } catch (error) {
        res.status(500).json({ message: 'Error creating news post', error: error.message });
    }
});

// PUT route to update a news post (UPDATE)
app.put('/news/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedPost = await NewsPost.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'News post not found' });
        }
        res.redirect('/news');
    } catch (error) {
        res.status(500).json({ message: 'Error updating news post', error: error.message });
    }
});

// DELETE route to delete a news post (DELETE)
app.delete('/news/:id', async (req, res) => {
    try {
        const deletedPost = await NewsPost.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'News post not found' });
        }
        res.redirect('/news');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news post', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});