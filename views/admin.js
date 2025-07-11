const token = localStorage.getItem('token');

// Post Internship
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('postInternshipForm');
    if (form) {
        form.onsubmit = async function (e) {
            e.preventDefault();
            const data = {
                title: document.getElementById('title').value,
                company: document.getElementById('company').value,
                location: document.getElementById('location').value,
                stipend: document.getElementById('stipend').value,
                duration: document.getElementById('duration').value,
                description: document.getElementById('description').value
            };

            const res = await fetch('/api/internships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify(data)
            });
            const responseData = await res.json();
            if (res.ok) {
                alert('Internship posted!');
                form.reset();
                loadInternships();
            } else {
                document.getElementById('postError').innerText = responseData.error;
            }
        };
    }

    loadInternships();
    loadApplications();

    document.getElementById('logoutBtn').onclick = async function (e) {
        e.preventDefault();
        await fetch('/api/logout', { method: 'POST' });
        localStorage.clear();
        window.location.href = 'home.html';
    }
});

// Load all internships
async function loadInternships() {
    const res = await fetch('/api/internships');
    const internships = await res.json();
    const list = document.getElementById('internshipList');
    list.innerHTML = '';
    internships.forEach(internship => {
        const li = document.createElement('li');
        li.textContent = `${internship.title} at ${internship.company} (${internship.duration}) ${internship.location}`;
        list.appendChild(li);
    });
}



async function loadApplications() {
    const res = await fetch('/api/applications');
    const applications = await res.json();
    const tbody = document.getElementById('applicationsTableBody');
    tbody.innerHTML = '';

    if (!Array.isArray(applications) || applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No applications found.</td></tr>';
        return;
    }

    applications.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${app.Internship ? app.Internship.title : app.internshipId}</td>
            <td>${app.studentName}</td>
            <td>${app.collegeName}</td>
            <td>${app.semester}</td>
            <td>${app.year}</td>
            <td>${app.experience}</td>
            <td>${app.bio}</td>
            <td>
                ${app.resumePath ? `<a href="/uploads/${app.resumePath}" target="_blank">View Resume</a>` : 'No Resume'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}
