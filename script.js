document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  const projectsContainer = document.getElementById('projects-container');
  console.log('Projects container:', projectsContainer);

  const toggleSwitch = document.getElementById('toggle-dark-mode');
  const gridBackground = document.querySelector('.grid-background');
  const root = document.documentElement;

  toggleSwitch.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode');
      updateGridColor();
  });

  document.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      gridBackground.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  function updateGridColor() {
      const isDarkMode = document.body.classList.contains('dark-mode');
      const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      root.style.setProperty('--grid-color', gridColor);
  }

  window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      projectsContainer.style.transform = `translateY(${scrollY * 0.1}px)`;
  });

  fetch('projects.json')
    .then(response => response.json())
    .then(projectsData => {
      console.log('Projects data:', projectsData);
      if (projectsData.length === 0) {
          console.log('No projects found in data');
          projectsContainer.textContent = 'No projects found.';
      } else {
          projectsData.forEach((project, index) => {
              console.log('Creating project card for:', project.title);
              const projectCard = document.createElement('div');
              projectCard.className = 'project-card';

              const cardFront = document.createElement('div');
              cardFront.className = 'card-front';

              const mediaContainer = document.createElement('div');
              mediaContainer.className = 'media-container';

              if (project.mediaType === 'video') {
                  const projectVideo = document.createElement('video');
                  projectVideo.src = project.mediaUrl;
                  projectVideo.muted = true;
                  projectVideo.loop = true;
                  projectVideo.playsInline = true;
                  projectVideo.autoplay = true;
                  mediaContainer.appendChild(projectVideo);
              } else if (project.mediaType === 'image') {
                  const projectImage = document.createElement('img');
                  projectImage.src = project.mediaUrl;
                  projectImage.alt = project.title;
                  mediaContainer.appendChild(projectImage);
              }

              cardFront.appendChild(mediaContainer);

              const cardBack = document.createElement('div');
              cardBack.className = 'card-back';

              const projectDescription = document.createElement('p');
              projectDescription.textContent = project.description;

              const projectLink = document.createElement('a');
              projectLink.href = project.repoLink;
              projectLink.textContent = 'View Project';
              projectLink.target = '_blank';

              cardBack.appendChild(projectDescription);
              cardBack.appendChild(projectLink);

              const projectTitle = document.createElement('div');
              projectTitle.className = 'project-title';
              projectTitle.textContent = project.title;

              projectCard.appendChild(cardFront);
              projectCard.appendChild(cardBack);
              projectCard.appendChild(projectTitle);

              projectCard.addEventListener('click', (e) => {
                  if (!e.target.closest('a')) {
                      window.open(project.repoLink, '_blank');
                  }
              });

              projectsContainer.appendChild(projectCard);
              console.log('Project card appended:', project.title);
          });
      }
    })
    .catch(error => {
        console.error('Error fetching projects:', error);
        projectsContainer.textContent = 'Error loading projects.';
    });

  updateGridColor();
});
