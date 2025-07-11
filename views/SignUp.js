document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('SignUpForm').onsubmit = async function (e) {
        e.preventDefault();
        const password = document.querySelector('input[name="password"]').value;
        // Regex: at least 8 chars, one letter, one number, one symbol
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
        if (!passwordPattern.test(password)) {
            document.getElementById('SignUpError').innerText =
                'Password must be at least 8 characters and include a letter, a number, and a symbol.';
            return;
        }
        const form = document.getElementById('SignUpForm');
        const formData = new FormData(form);

        try {
            const res = await fetch('/api/SignUp', {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if (res.ok) {
                alert('SignUp Successful!');
                window.location.href = 'home.html'; // or wherever you want to redirect
            } else {
                // Check for unique constraint error
                if (result.error && (result.error.includes('username') || result.error.includes('email'))) {
                    alert(result.error); // Shows "username must be unique" or "email must be unique"
                } else {
                    alert(result.error || 'Already exists.');
                }
            }
        } catch (err) {
            alert('SignUp failed.');
        }
    };
});