// Example: Logout button functionality for all pages
document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = 'home.html';
    });
  }
});

// Handle login form submission
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

// Handle registration form submission
const SignUpForm = document.getElementById('SignUpForm');
if (SignUpForm) {
  SignUpForm.onsubmit = async function (e) {
    e.preventDefault();
    const form = document.getElementById('SignUpForm');
    const formData = new FormData(form);

    const res = await fetch('/api/SignUp', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = 'login.html';
    } else {
      document.getElementById('SignUpError').innerText = data.error;
    }
  };
}

// Toggle navigation menu on mobile
document.getElementById('navToggle').addEventListener('click', function() {
  const navList = document.querySelector('.main-header nav ul');
  navList.classList.toggle('active');
});

// You can add more shared JS functions here as needed.