fetch('/content/gigs')
    .then(response => response.json())
    .then(data => {
        const gigsContainer = document.getElementById('gigs');
        data.forEach(gig => {
            const gigHTML = `
                <div class="gig">
                    <h3>${gig.date}</h3>
                    <p>${gig.location}</p>
                    <p>${gig.details}</p>
                    ${gig.ticket_url ? `<a href="${gig.ticket_url}">Buy Tickets</a>` : ''}
                </div>
            `;
            gigsContainer.innerHTML += gigHTML;
        });
    });