document.querySelectorAll('.toggle-bio').forEach(button => {
    button.addEventListener('click', () => {
      const fullBio = button.previousElementSibling; // Selects the .bio-full div
      const isHidden = fullBio.style.display === 'none';
  
      if (isHidden) {
        fullBio.style.display = 'block'; // Show the full bio
        button.textContent = 'Show Less'; // Update button text
      } else {
        fullBio.style.display = 'none'; // Hide the full bio
        button.textContent = 'Read More'; // Update button text
      }
    });
  });