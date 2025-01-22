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

