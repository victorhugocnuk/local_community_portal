// app.js

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 5000;

// Importa o modelo NewsPost
const NewsPost = require('./models/NewsPost');

// Importa o router de notícias
const newsRoutes = require('./routes/newsRoutes');

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/community_portal_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Configura o EJS como o view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Rotas de Navegação e Páginas Estáticas
app.get('/', (req, res) => {
    res.render('index', { 
        pageTitle: 'Welcome to Local Community Portal',
        newsPosts: []
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { pageTitle: 'Contact Us' });
});

app.get('/faq', (req, res) => {
    res.render('faq', { pageTitle: 'Frequently Asked Questions' });
});

// Usa o router para todas as rotas que começam com /news
app.use('/news', newsRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});