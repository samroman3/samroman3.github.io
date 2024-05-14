# Portfolio

Showcase of my pinned projects from GitHub, dynamically generated using a Node.js script. The site supports dark mode and is optimized for both desktop and mobile views.

[https://samroman3.github.io](https://samroman3.github.io)

## Features

- **Dynamic Content**: The projects are fetched from my GitHub profile using a scraping script.
- **Responsive Design**: The site is designed to look great on both desktop and mobile devices.
- **Dark Mode**: Toggle between light and dark mode with an iOS-style switch.

### Technologies Used

- **HTML**: Site structure.
- **CSS**: Custom styles for the site, including a responsive layout and dark mode support.
- **JavaScript**: Handles fetching project data and toggling dark mode.
- **Google Fonts**: Fira Code font for a clean and modern look.
- **Node.js**: Build script to fetch and process project data.
- **axios**: HTTP requests to fetch data from GitHub.
- **cheerio**: Parses HTML and extracts the necessary data.
- **marked**: Converts Markdown content from GitHub README files to HTML, used to extract Images.

### Scraping and Building

1. **Fetching Projects**: The `build.js` script fetches my GitHub profile and scrapes the pinned projects using `axios` and `cheerio`.
2. **Processing Data**: The script processes the project data, including extracting the first image from the README file using `marked`.
3. **Generating JSON**: The script writes the project data to `projects.json`, which is then used by the frontend to display the projects.

