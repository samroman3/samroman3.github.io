document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');

    fetch('/pinned-projects')
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';

                const projectImage = document.createElement('img');
                projectImage.src = project.imageUrl || 'path/to/default/image.png'; // Use a default image if none found

                const projectDetails = document.createElement('div');
                projectDetails.className = 'project-details';

                const projectTitle = document.createElement('h3');
                projectTitle.textContent = project.title;

                const projectDescription = document.createElement('p');
                projectDescription.textContent = project.description;

                const projectLink = document.createElement('a');
                projectLink.href = project.repoLink;
                projectLink.textContent = 'View on GitHub';
                projectLink.target = '_blank';

                projectDetails.appendChild(projectTitle);
                projectDetails.appendChild(projectDescription);
                projectDetails.appendChild(projectLink);

                projectCard.appendChild(projectImage);
                projectCard.appendChild(projectDetails);

                projectsContainer.appendChild(projectCard);
            });
        })
        .catch(error => console.error('Error fetching pinned repos:', error));
});
