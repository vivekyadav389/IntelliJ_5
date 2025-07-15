let allInternships = [];

// Fetch internships from the backend and display them in the list
async function loadInternships() {
    try {
        const res = await fetch('/api/internships');
        if (!res.ok) throw new Error('Failed to fetch internships');
        allInternships = await res.json();
        renderInternshipList(allInternships);
        populateFilters(); 
    } catch (err) {
        document.getElementById('internshipList').innerHTML = `<li class="error-message">${err.message}</li>`;
    }
}

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
                <a href="#" class="apply-link" data-id="${internship.id}">Apply Now</a>
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

    // Add click event for each "Apply Now" link
    document.querySelectorAll('.apply-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const card = e.target.closest('.internship-card');
            openApplyModal(card.dataset.id);
        });
    });
}

// Filter and search functionality
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

document.getElementById('searchBtn').onclick = filterInternships;
document.getElementById('searchBox').oninput = filterInternships;
document.getElementById('locationFilter').onchange = filterInternships;
document.getElementById('domainFilter').onchange = filterInternships;

// Show details in the #internshipDetails section
function showInternshipDetails(internship) {
    document.getElementById('internshipTitle').textContent = internship.title;
    document.getElementById('internshipDescription').textContent = internship.description;
    document.getElementById('internshipCompany').textContent = internship.company;
    document.getElementById('internshipLocation').textContent = internship.location;
    document.getElementById('internshipStipend').textContent = internship.stipend || 'Not specified';
    document.getElementById('internshipDuration').textContent = internship.duration;
    document.getElementById('internshipPostedDate').innerText = internship.createdAt
        ? new Date(internship.createdAt).toLocaleDateString()
        : 'N/A';
    document.getElementById('applyInternshipId').value = internship.id;

    // Set up Apply button to close details modal and open apply modal
    document.getElementById('applyButton').onclick = function () {
        document.getElementById('internshipDetailsModal').classList.add('modal-hidden');
        openApplyModal(internship.id);
    };

    // Show the modal
    document.getElementById('internshipDetailsModal').classList.remove('modal-hidden');
}

// Close modal logic
document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.getElementById('closeDetailsModal');
    const modal = document.getElementById('internshipDetailsModal');
    if (closeBtn && modal) {
        closeBtn.onclick = () => modal.classList.add('modal-hidden');
        // Optional: close when clicking outside modal content
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.add('modal-hidden');
        };
    }
});

function openApplyModal(internshipId) {
    document.getElementById('applyModal').classList.remove('modal-hidden');
    document.getElementById('applyInternshipId').value = internshipId;
}
window.closeModal = function () {
    console.log('Close button clicked');
    document.getElementById('applyModal').classList.add('modal-hidden');
    document.getElementById('applyForm').reset();
    document.getElementById('applyError').innerText = '';
};

// Populate location and domain filters
function populateFilters() {
    const locations = [...new Set(allInternships.map(i => i.location))];
    const domains = [...new Set(allInternships.map(i => i.domain))];

    const locationFilter = document.getElementById('locationFilter');
    const domainFilter = document.getElementById('domainFilter');

    // Clear existing options
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

// Initial load
window.onload = async function () {
    // Fetch the user profile (use actual user id or session)
    const res = await fetch('/api/profile?userId=5'); // Replace 5 with actual user id
    const user = await res.json();
    document.getElementById('headerProfileIcon').src = user.profilePic
        ? `/uploads/${user.profilePic}`
        : '/public/default-profile.png';

    // Set username from backend user object
    document.getElementById('userName').innerText = user.username || 'User';

    loadInternships();
};

document.getElementById('applyForm').onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    try {
        const res = await fetch('/api/applications', {
            method: 'POST',
            body: formData
        });
        let data;
        try {
            data = await res.json();
        } catch {
            document.getElementById('applyError').innerText = 'Server error. Please try again later.';
            return;
        }
        if (res.ok) {
            alert('Application submitted!');
            closeModal();
        } else {
            document.getElementById('applyError').innerText = data.error || 'Submission failed.';
        }
    } catch (err) {
        document.getElementById('applyError').innerText = 'Submission failed.';
        console.error('Application error:', err);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('closeApplyModalBtn').addEventListener('click', closeModal);

    // Slider logic
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    const visibleSlides = 3;
    const totalSlides = slides.length;

    function showSlides() {
        const slideWidth = slides[0].offsetWidth + 30; // 16px for padding
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function nextSlide() {
        if (currentIndex < totalSlides - visibleSlides) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        showSlides();
    }

    // Auto slide every 2.5 seconds
    setInterval(nextSlide, 2500);

    // Initial position
    showSlides();
});
