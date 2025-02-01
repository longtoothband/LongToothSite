document.addEventListener("DOMContentLoaded", () => {
    // Path to the gigs.json file
    const gigsDataURL = "/data/gigs.json";
  
    fetch(gigsDataURL)
      .then((res) => res.json())
      .then((gigs) => {
        const gigsList = document.getElementById("gigs-list");
  
        // Clear the container (if needed)
        gigsList.innerHTML = "";
  
        // Loop through gigs and create elements
        gigs.forEach((gig) => {
          const gigElement = document.createElement("div");
          gigElement.classList.add("gig-entry", "mb-3", "p-3", "border", "rounded");
  
          gigElement.innerHTML = `
            <p><strong>Date:</strong> ${gig.Date}</p>
            <p><strong>Location:</strong> ${gig.Location}</p>
            <p><strong>Time:</strong> ${gig.Time}</p>
          `;
  
          // Append the gig entry to the container
          gigsList.appendChild(gigElement);
        });
      })
      .catch((error) => {
        console.error("Error fetching gigs data:", error);
      });
  });
  