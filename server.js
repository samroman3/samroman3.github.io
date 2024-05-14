const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve the index.html file for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/pinned-projects', async (req, res) => {
  try {
    const profileUrl = 'https://github.com/samroman3';
    const { data } = await axios.get(profileUrl);
    const $ = cheerio.load(data);
    const pinnedItems = $('.pinned-item-list-item');

    const projects = [];

    pinnedItems.each((index, element) => {
      const title = $(element).find('.repo').text().trim();
      const description = $(element).find('.pinned-item-desc').text().trim();
      const repoLink = `https://github.com${$(element).find('.repo').attr('href')}`;
      const imageUrl = `${repoLink}/blob/main/path/to/your/image.png?raw=true`; 

      projects.push({ title, description, repoLink, imageUrl });
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
