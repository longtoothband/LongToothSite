document.querySelectorAll('.toggle-bio').forEach(button => {
    button.addEventListener('click', () => {
        const bioContainer = button.previousElementSibling;
        const fullBio = button.previousElementSibling;
        const bioShort = bioContainer.querySelector('.bio-full');

        if (fullBio.style.maxHeight === '0px' || fullBio.style.maxHeight === '') {
           fullBio.style.maxHeight = fullBio.scrollHeight + 'px'; // Expand smoothly
            bioShort.style.display = 'none'; // Hide short bio
            button.textContent = 'Read Less';
        } else {
           fullBio.style.maxHeight = '0px'; // Collapse smoothly
            bioShort.style.display = 'block'; // Show short bio
            button.textContent = 'Read More';
        }
    });
});