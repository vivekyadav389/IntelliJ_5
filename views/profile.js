// Load and display personal details (fetch from backend if needed)
document.getElementById('profileForm').onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('college', document.getElementById('college').value);
    formData.append('semester', document.getElementById('semester').value);
    formData.append('year', document.getElementById('year').value);

    // If a new profile pic is selected
    const fileInput = document.getElementById('profilePicInput');
    if (fileInput && fileInput.files[0]) {
        formData.append('profilePic', fileInput.files[0]);
    }

    const res = await fetch('/api/profile/update', { // Use actual user id
        method: 'POST',
        body: formData
    });
    const data = await res.json();
    if (res.ok) {
        alert('Profile updated!');
        window.location.reload();
    } else {
        alert(data.error || 'Update failed');
    }
};

// Load applied internships
async function loadAppliedInternships() {
    const res = await fetch('/api/my-applications'); // Adjust endpoint as needed
    const applications = await res.json();
    const list = document.getElementById('appliedInternshipsList');
    list.innerHTML = '';
    applications.forEach(app => {
        const li = document.createElement('li');
        li.textContent = `${app.Internship.title} at ${app.Internship.company} (${app.Internship.location})`;
        list.appendChild(li);
    });
}

// Load applications for the user
async function loadApplications() {
    // If you use session, you don't need userId in query
    const res = await fetch('/api/applications');
    const applications = await res.json();
    const list = document.getElementById('applicationList');
    list.innerHTML = '';
    applications.forEach(app => {
        const internshipTitle = app.Internship ? app.Internship.title : 'Internship';
        const appliedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '';
        const resumeLink = app.resumePath
            ? `<a href="/uploads/${app.resumePath}" target="_blank">Download Resume</a>`
            : 'No Resume';
        list.innerHTML += `
            <li>
                <strong>${internshipTitle}</strong> (Applied on ${appliedDate})<br>
                College: ${app.collegeName} | Semester: ${app.semester} | Year: ${app.year}<br>
                ${resumeLink}
            </li>
        `;
    });
}

// Click profile image to trigger file input
document.getElementById('profileImage').onclick = function () {
    document.getElementById('profilePicInput').click();
};

// Preview new profile pic
document.getElementById('profilePicInput').onchange = function (e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('profileImage').src = URL.createObjectURL(file);
    }
};

// Show remove button if profilePic exists
window.onload = async function () {
    const res = await fetch('/api/profile');
    const user = await res.json();
    document.getElementById('username').value = user.username || '';
    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('college').value = user.college || '';
    document.getElementById('semester').value = user.semester || '';
    document.getElementById('year').value = user.year || '';
    document.getElementById('profileImage').src = user.profilePic
        ? `/uploads/${user.profilePic}`
        : 'default-profile.png';
    document.getElementById('deletePicBtn').style.display = user.profilePic ? 'block' : 'none';

    loadAppliedInternships();
    loadApplications();
};

// Remove profile picture
document.getElementById('deletePicBtn').onclick = async function () {
    if (confirm('Remove profile picture?')) {
        const res = await fetch('/api/profile/delete-pic', { method: 'POST' });
        if (res.ok) {
            alert('Profile picture removed!');
            window.location.reload();
        } else {
            alert('Failed to remove profile picture');
        }
    }
};

document.getElementById('logoutBtn').onclick = async function() {
    // Optionally call your backend logout endpoint here
    // await fetch('/api/logout', { method: 'POST' });

    // Redirect to login page
    window.location.href = 'home.html';
};