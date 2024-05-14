const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { marked } = require('marked'); // Correct import
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const username = 'samroman3';

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
    const profileUrl = `https://github.com/${username}`;
    const { data } = await axios.get(profileUrl);
    const $ = cheerio.load(data);
    const pinnedItems = $('.pinned-item-list-item');

    const projects = [];

    for (let index = 0; index < pinnedItems.length; index++) {
      const element = pinnedItems[index];
      const title = $(element).find('.repo').text().trim();
      const description = $(element).find('.pinned-item-desc').text().trim();
      const repoLink = `https://github.com/${username}/${title}`;

      const readmeUrl = `https://raw.githubusercontent.com/${username}/${title}/main/README.md`;
      let imageUrl = '';

      try {
        const readmeResponse = await axios.get(readmeUrl);
        const readmeContent = readmeResponse.data;

        // Parse README.md and extract the first image URL
        const readmeHtml = marked.parse(readmeContent); // Use marked.parse
        const readme$ = cheerio.load(readmeHtml);
        const firstImage = readme$('img').first().attr('src');

        if (firstImage) {
          imageUrl = firstImage.startsWith('http') ? firstImage : `${repoLink}/blob/main/${firstImage}?raw=true`;
        }
      } catch (error) {
        console.error(`Error fetching README.md for ${repoLink}:`, error);
      }

      projects.push({ title, description, repoLink, imageUrl });
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
