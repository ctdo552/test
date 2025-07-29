document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorBox = document.getElementById('loginError');
    // Demo: username=admin, password=123456
    if (username === 'admin' && password === 'Thait123%%') {
        errorBox.style.display = 'none';
        sessionStorage.setItem('gracUser', JSON.stringify({username: username, role: 'admin'}));
        window.location.href = 'layout.html';
    } else {
        errorBox.style.display = 'block';
    }
}); 