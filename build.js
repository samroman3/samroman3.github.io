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
      let mediaUrl = '';
      let mediaType = '';

      try {
        const readmeResponse = await axios.get(readmeUrl);
        const readmeContent = readmeResponse.data;

        const readmeHtml = marked.parse(readmeContent);
        const readme$ = cheerio.load(readmeHtml);
        
        const firstImage = readme$('img').first().attr('src');
        const firstVideo = readme$('video source').first().attr('src') || readme$('video').first().attr('src');

        if (firstVideo) {
          mediaUrl = firstVideo.startsWith('http') ? firstVideo : `${repoLink}/blob/main/${firstVideo}?raw=true`;
          mediaType = 'video';
        } else if (firstImage) {
          mediaUrl = firstImage.startsWith('http') ? firstImage : `${repoLink}/blob/main/${firstImage}?raw=true`;
          mediaType = 'image';
        }
      } catch (error) {
        console.error(`Error fetching README.md for ${repoLink}:`, error);
      }

      let readmePreview = '';

      try {
        const readmeResponse = await axios.get(readmeUrl);
        const readmeContent = readmeResponse.data;
        readmePreview = readmeContent.split('\n\n').slice(0, 2).join('\n\n');
      } catch (error) {
        console.error(`Error fetching README.md for ${repoLink}:`, error);
      }

      projects.push({ title, description, repoLink, mediaUrl, mediaType, readmePreview });
    }

    return projects;
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    return [];
  }
}

async function build() {
  const projects = await fetchPinnedProjects();
  console.log('Fetched projects:', projects);
  const projectsFilePath = path.join(__dirname, 'projects.json');

  fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), 'utf-8');
  console.log('Projects data saved to projects.json');
}

build();
