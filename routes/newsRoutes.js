const express = require('express');
const router = express.Router();
const NewsPost = require('../models/NewsPost'); // Ajuste o caminho conforme a sua estrutura

// Rota GET para exibir a lista de notícias (READ)
router.get('/', async (req, res) => {
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

// Rota GET para exibir o formulário de criação (CREATE)
router.get('/create', (req, res) => {
    res.render('create', { pageTitle: 'Create New Post' });
});

// Rota GET para exibir o formulário de edição (UPDATE)
router.get('/edit/:id', async (req, res) => {
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

// Rota POST para criar uma nova notícia (CREATE)
router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new NewsPost({ title, content });
        await newPost.save();
        res.redirect('/news');
    } catch (error) {
        res.status(500).json({ message: 'Error creating news post', error: error.message });
    }
});

// Rota PUT para atualizar uma notícia (UPDATE)
router.put('/:id', async (req, res) => {
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

// Rota DELETE para excluir uma notícia (DELETE)
router.delete('/:id', async (req, res) => {
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

module.exports = router;