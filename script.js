document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');
    const gradientContainer = document.querySelector('.gradient-container');

    // Handle gradient movement
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        gradientContainer.style.setProperty('--mouse-x', `${x}%`);
        gradientContainer.style.setProperty('--mouse-y', `${y}%`);
    });

    fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            projects.forEach(project => {
                const projectCard = document.createElement('a');
                projectCard.className = 'project-card';
                projectCard.href = project.repoLink;
                projectCard.target = '_blank';

                const projectIcon = document.createElement('img');
                projectIcon.className = 'project-icon';
                projectIcon.src = project.mediaUrl;
                projectIcon.alt = project.title;

                const projectInfo = document.createElement('div');
                projectInfo.className = 'project-info';

                const projectTitle = document.createElement('span');
                projectTitle.className = 'project-title';
                projectTitle.textContent = project.title;

                const projectYear = document.createElement('span');
                projectYear.className = 'project-year';
                projectYear.textContent = project.year;

                projectInfo.appendChild(projectTitle);
                projectInfo.appendChild(projectYear);

                projectCard.appendChild(projectIcon);
                projectCard.appendChild(projectInfo);

                projectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            projectsContainer.textContent = 'Error loading projects.';
        });
});
