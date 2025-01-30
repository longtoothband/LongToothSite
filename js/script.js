//import WaveSurfer from '/node_modules/wavesurfer.js';

emailjs.init("mq2m9pFC7sY4n-jMS")

// SendMail function
function SendMail(event){
    event.preventDefault(); 

    var params = {
        from_name : document.getElementById("fullName").value.trim(),
        email_id : document.getElementById("email_id").value.trim(),
        message : document.getElementById("message").value.trim()
    }
    emailjs.send("service_k7hohbb","template_qmrxhsb", params).then(function(res){
        alert("Success!" + res.status);
        document.getElementById("contact-form").reset();
    })
    .catch(function (error) {
        alert("Error: " + error.text);
    });


}

// Add event listener to form
document.getElementById("contact-form").addEventListener("submit", SendMail);

// Bio toggles
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


// Music player// 
document.querySelectorAll('.play-pause').forEach(button => {
    button.addEventListener('click', function () {
      const audioId = this.dataset.audio;
      const audio = document.getElementById(audioId);
      const icon = this.querySelector('.bi');
  
      // Pause all other tracks
      document.querySelectorAll('audio').forEach(otherAudio => {
        if (otherAudio !== audio) {
          otherAudio.pause();
          otherAudio.currentTime = 0; // Reset other tracks
        }
      });
  
      // Play or pause the current track
      if (audio.paused) {
        audio.play();
        icon.classList.remove('bi-play-fill');
        icon.classList.add('bi-pause-fill');
      } else {
        audio.pause();
        icon.classList.remove('bi-pause-fill');
        icon.classList.add('bi-play-fill');
      }
  
      // Update progress bar
      audio.addEventListener('timeupdate', () => {
        const progressBar = this.nextElementSibling;
        progressBar.value = (audio.currentTime / audio.duration) * 100;
      });
  
      // Reset button when audio ends
      audio.addEventListener('ended', () => {
        icon.classList.add('bi-play-fill');
      });
    });
  });



   

