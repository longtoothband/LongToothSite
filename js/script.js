if (typeof emailjs !== "undefined") {
    emailjs.init("mq2m9pFC7sY4n-jMS");
}

function SendMail(event) {
    event.preventDefault();

    var params = {
        from_name: document.getElementById("fullName").value.trim(),
        email_id: document.getElementById("email_id").value.trim(),
        message: document.getElementById("message").value.trim()
    };
    emailjs.send("service_k7hohbb", "template_qmrxhsb", params).then(function (res) {
        alert("Success!" + res.status);
        document.getElementById("contact-form").reset();
    })
    .catch(function (error) {
        alert("Error: " + error.text);
    });
}

document.getElementById("contact-form").addEventListener("submit", SendMail);

document.querySelectorAll('.toggle-bio').forEach(button => {
    button.addEventListener('click', () => {
        const bioContainer = button.previousElementSibling;
        const fullBio = button.previousElementSibling;
        const bioShort = bioContainer.querySelector('.bio-full');

        if (fullBio.style.maxHeight === '0px' || fullBio.style.maxHeight === '') {
           fullBio.style.maxHeight = fullBio.scrollHeight + 'px';
            bioShort.style.display = 'none';
            button.textContent = 'Read Less';
        } else {
           fullBio.style.maxHeight = '0px';
            bioShort.style.display = 'block';
            button.textContent = 'Read More';
        }
    });
});
