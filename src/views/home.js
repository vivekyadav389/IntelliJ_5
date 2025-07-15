const API_BASE = 'https://intellij5-production.up.railway.app/api';

let allInternships = [];


// Fetch internships from backend and render
async function loadInternships() {
    try {
        const res = await fetch(`${API_BASE}/internships`);
        if (!res.ok) throw new Error('Failed to fetch internships');
        allInternships = await res.json();
        renderInternshipList(allInternships);
        populateFilters();
    } catch (err) {
        document.getElementById('internshipList').innerHTML = `<div class="error-message">${err.message}</div>`;
    }
}

// Render internships as cards
function renderInternshipList(internships) {
    const list = document.getElementById('internshipList');
    list.innerHTML = '';
    internships.forEach(internship => {
        const card = document.createElement('div');
        card.className = 'internship-card';
        card.innerHTML = `
            <h3 class="internship-title">${internship.title}</h3>
            <span> ${internship.description}</span>
            <div class="internship-info">
                <span>🏢 Company: ${internship.company}</span><br/>
                <span>📍 Location: ${internship.location}</span><br/>
                <span>💰 Stipend: ${internship.stipend || 'Not specified'}</span><br/>
                <span>⏳ Duration: ${internship.duration}</span><br/>
                <span>📅 Posted on: ${internship.createdAt ? new Date(internship.createdAt).toLocaleDateString() : 'N/A'}</span><br/>
                <span>👥 Applicants: ${internship.applicantsCount || 0}</span><br/>
                <span>📈 Views: ${internship.views || 0}</span><br/>
                <span>⭐ Rating: ${internship.rating || 'N/A'}</span><br/>
                
                
            </div>
            <div class="internship-actions">
                <button class="internship-btn" data-id="${internship.id}">Internship</button>
                <a href="#" class="view-details-link" data-id="${internship.id}">View details &rarr;</a>
            </div>
        `;
        // Store internship data for details
        card.dataset.id = internship.id;
        card.dataset.title = internship.title;
        card.dataset.company = internship.company;
        card.dataset.location = internship.location;
        card.dataset.stipend = internship.stipend || '';
        card.dataset.duration = internship.duration;
        card.dataset.description = internship.description;
        card.dataset.createdAt = internship.createdAt || '';
        list.appendChild(card);
    });

    // Add event listeners for details
    document.querySelectorAll('.view-details-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const card = e.target.closest('.internship-card');
            showInternshipDetails({
                title: card.dataset.title,
                company: card.dataset.company,
                location: card.dataset.location,
                stipend: card.dataset.stipend,
                duration: card.dataset.duration,
                description: card.dataset.description,
                createdAt: card.dataset.createdAt
            });
        });
    });
}

// Show internship details (you can use a modal or a section)
function showInternshipDetails(internship) {
    alert(
        `Title: ${internship.title}\nCompany: ${internship.company}\nLocation: ${internship.location}\nStipend: ${internship.stipend}\nDuration: ${internship.duration}\nDescription: ${internship.description}\nPosted: ${internship.createdAt ? new Date(internship.createdAt).toLocaleDateString() : 'N/A'
        }`
    );
    // Replace alert with your modal or detail section logic if needed
}

// Filter logic
function filterInternships() {
    const query = document.getElementById('searchBox').value.toLowerCase();
    const location = document.getElementById('locationFilter').value;
    const domain = document.getElementById('domainFilter').value;

    const filtered = allInternships.filter(internship => {
        const matchesQuery =
            internship.title.toLowerCase().includes(query) ||
            internship.company.toLowerCase().includes(query) ||
            internship.location.toLowerCase().includes(query) ||
            internship.description.toLowerCase().includes(query) ||
            internship.duration.toLowerCase().includes(query);

        const matchesLocation = !location || internship.location === location;
        const matchesDomain = !domain || internship.domain === domain;

        return matchesQuery && matchesLocation && matchesDomain;
    });

    renderInternshipList(filtered);
}


// Populate filters
function populateFilters() {
    const locations = [...new Set(allInternships.map(i => i.location))];
    const domains = [...new Set(allInternships.map(i => i.domain))];

    const locationFilter = document.getElementById('locationFilter');
    const domainFilter = document.getElementById('domainFilter');

    locationFilter.innerHTML = '<option value="">All Locations</option>';
    domainFilter.innerHTML = '<option value="">All Domains</option>';

    locations.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc;
        option.textContent = loc;
        locationFilter.appendChild(option);
    });

    domains.forEach(dom => {
        const option = document.createElement('option');
        option.value = dom;
        option.textContent = dom;
        domainFilter.appendChild(option);
    });
}

// Event listeners
document.getElementById('searchBtn').onclick = filterInternships;
document.getElementById('searchBox').oninput = filterInternships;
document.getElementById('locationFilter').onchange = filterInternships;
document.getElementById('domainFilter').onchange = filterInternships;

// Initial load
window.onload = loadInternships;

document.addEventListener('DOMContentLoaded', function () {
    // Show login modal
    const signInBtn = document.querySelector('.nav-btn[href="./login.html"]');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');

    if (signInBtn && loginModal && closeLoginModal) {
        signInBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loginModal.classList.remove('modal-hidden');
        });
        closeLoginModal.addEventListener('click', function () {
            loginModal.classList.add('modal-hidden');
        });
        // Optional: close modal on outside click
        loginModal.addEventListener('click', function (e) {
            if (e.target === loginModal) loginModal.classList.add('modal-hidden');
        });
    }

    // Login form logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = async function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                window.location.href = data.isAdmin ? 'admin.html' : 'internships.html';
            } else {
                document.getElementById('loginError').innerText = data.error;
            }
        };
    }


    const slider = document.getElementById('slider');
    let slides = slider.querySelectorAll('.slide');
    const visibleSlides = Math.min(3, slides.length);
    let currentIndex = visibleSlides;
    let autoPlayInterval;

    // Clone slides for infinite effect
    for (let i = 0; i < visibleSlides; i++) {
        slider.appendChild(slides[i].cloneNode(true));
        slider.insertBefore(slides[slides.length - 1 - i].cloneNode(true), slider.firstChild);
    }

    slides = slider.querySelectorAll('.slide');

    function updateSlider(animate = true) {
        const slideWidth = slides[0].offsetWidth + 30;
        slider.style.transition = animate ? 'transform 0.5s ease' : 'none';
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function nextSlide() {
        currentIndex++;
        updateSlider();
        if (currentIndex === slides.length - visibleSlides) {
            setTimeout(() => {
                slider.style.transition = 'none';

                currentIndex = visibleSlides;
                updateSlider(false);
            }, 500);
        }
    }

    function autoplay() {
        autoPlayInterval = setInterval(nextSlide, 2500);
    }

    // Wait for images to load before starting
    const images = slider.querySelectorAll('img');
    let loaded = 0;
    images.forEach(img => {
        if (img.complete) {
            loaded++;
            if (loaded === images.length) {
                updateSlider(false);
                autoplay();
            }
        } else {
            img.onload = img.onerror = () => {
                loaded++;
                if (loaded === images.length) {
                    updateSlider(false);
                    autoplay();
                }
            };
        }
    });

    window.addEventListener('resize', () => updateSlider(false));
});
