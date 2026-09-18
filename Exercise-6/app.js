var express = require('express');
const fs = require('fs');
const path = require('path');
const articles = require('./articles');
const videos = require('./videos');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to Express App (Exercise 6)');
});

// =========================================================
// Exercise 1: Read and Update data.json
// =========================================================
const dataFilePath = path.join(__dirname, 'data.json');

// GET /data - return data from data.json
app.get('/data', (req, res) => {
    try {
        const rawData = fs.readFileSync(dataFilePath, 'utf8');
        const jsonData = JSON.parse(rawData);
        res.status(200).json(jsonData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /update - update data in data.json
app.post('/update', (req, res) => {
    try {
        const newContent = req.body;
        fs.writeFileSync(dataFilePath, JSON.stringify(newContent, null, 4), 'utf8');
        res.status(200).json({ message: "The data has been updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =========================================================
// Exercise 2: Articles Router / CRUD
// =========================================================

// GET all articles
app.get('/articles', async (req, res) => {
    try {
        res.status(200).json(articles);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// GET a specific article by ID
app.get('/articles/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const article = articles.find(a => a.id === id);
        if (!article) {
            return res.status(404).send('Article not found');
        }
        res.status(200).json(article);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// POST a new article
app.post('/articles', (req, res) => {
    try {
        const newArticle = {
            id: articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1,
            title: req.body.title,
            date: req.body.date,
            text: req.body.text
        };
        articles.push(newArticle);
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT operation not supported on /articles
app.put('/articles', (req, res) => {
    res.status(403).send('PUT operation not supported on /articles');
});

// POST operation not supported on /articles/:id
app.post('/articles/:id', (req, res) => {
    res.status(403).send(`POST operation not supported on /articles/${req.params.id}`);
});

// PUT update an article by ID
app.put('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).send('Article not found');
    }
    articles[index] = {
        ...articles[index],
        ...req.body
    };
    res.status(200).json(articles[index]);
});

// DELETE an article by ID (supports /articles/:id and /article/:id)
const deleteArticleHandler = (req, res) => {
    const id = parseInt(req.params.id);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).send('Article not found');
    }
    const deletedArticle = articles.splice(index, 1);
    res.status(200).json(deletedArticle[0]);
};

app.delete('/articles/:id', deleteArticleHandler);
app.delete('/article/:id', deleteArticleHandler);

// =========================================================
// Exercise 3: Videos Router / CRUD
// =========================================================

// GET all videos
app.get('/videos', (req, res) => {
    res.status(200).json(videos);
});

// GET video by ID
app.get('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const video = videos.find(v => v.id === id);
    if (!video) {
        return res.status(404).send('Video not found');
    }
    res.status(200).json(video);
});

// POST new video
app.post('/videos', (req, res) => {
    const newVideo = {
        id: videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1,
        title: req.body.title,
        duration: req.body.duration,
        url: req.body.url
    };
    videos.push(newVideo);
    res.status(201).json(newVideo);
});

// PUT update video
app.put('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = videos.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).send('Video not found');
    }
    videos[index] = {
        ...videos[index],
        ...req.body
    };
    res.status(200).json(videos[index]);
});

// DELETE video
app.delete('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = videos.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).send('Video not found');
    }
    const deletedVideo = videos.splice(index, 1);
    res.status(200).json(deletedVideo[0]);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
