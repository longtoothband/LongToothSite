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

const navCollapse = document.getElementById("mainNavBar");
const navToggle = document.querySelector(".site-nav .navbar-toggler");

function hideMobileNav() {
    if (navCollapse && navCollapse.classList.contains("show") && window.bootstrap) {
        const instance = bootstrap.Collapse.getInstance(navCollapse);
        if (instance) {
            instance.hide();
        }
    }
    if (navToggle) {
        navToggle.blur();
    }
}

document.querySelectorAll(".site-nav .nav-link").forEach((link) => {
    link.addEventListener("click", hideMobileNav);
});

if (navCollapse) {
    navCollapse.addEventListener("hidden.bs.collapse", () => {
        if (navToggle) {
            navToggle.blur();
        }
    });
}

function warmCarouselImages() {
    const carousel = document.getElementById("carouselHeader");
    if (!carousel) {
        return;
    }

    const imgs = Array.from(carousel.querySelectorAll(".carousel-item img"));

    function preload(img) {
        if (!img) {
            return;
        }
        img.loading = "eager";
        const warm = new Image();
        warm.src = img.currentSrc || img.src;
    }

    preload(imgs[1]);

    carousel.addEventListener("slide.bs.carousel", (event) => {
        const nextIndex = event.to;
        preload(imgs[nextIndex]);
        preload(imgs[(nextIndex + 1) % imgs.length]);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", warmCarouselImages);
} else {
    warmCarouselImages();
}

function initWatchVideo() {
    const media = document.querySelector(".watch-media");
    const video = document.getElementById("watchVideo");
    const playButton = document.querySelector(".watch-play");
    if (!media || !video || !playButton) {
        return;
    }

    playButton.addEventListener("click", () => {
        video.controls = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") {
            playPromise.then(() => {
                media.classList.add("is-playing");
            }).catch(() => {});
        } else {
            media.classList.add("is-playing");
        }
    });

    video.addEventListener("play", () => {
        media.classList.add("is-playing");
        video.controls = true;
    });

    video.addEventListener("ended", () => {
        media.classList.remove("is-playing");
        video.controls = false;
        video.currentTime = 0;
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWatchVideo);
} else {
    initWatchVideo();
}

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
