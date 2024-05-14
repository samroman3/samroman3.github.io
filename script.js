document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');

    fetch('https://api.github.com/users/samroman3/repos')
        .then(response => response.json())
        .then(data => {
            data.forEach(repo => {
                if (repo.archived || repo.fork) {
                    return; // Skip archived and forked repos
                }

                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                const projectTitle = document.createElement('h3');
                projectTitle.textContent = repo.name;

                const projectLink = document.createElement('a');
                projectLink.href = repo.html_url;
                projectLink.textContent = 'View on GitHub';
                projectLink.target = '_blank';

                projectCard.appendChild(projectTitle);
                projectCard.appendChild(projectLink);

                projectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => console.error('Error fetching repos:', error));
});
