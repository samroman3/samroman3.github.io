const axios = require('axios');
const cheerio = require('cheerio');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const username = 'samroman3';

async function fetchPinnedProjects() {
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
        const readmeHtml = marked.parse(readmeContent);
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

    return projects;
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    return [];
  }
}

async function build() {
  const projects = await fetchPinnedProjects();
  const projectsFilePath = path.join(__dirname, 'public', 'projects.json');

  fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), 'utf-8');
  console.log('Projects data saved to projects.json');
}

build();
