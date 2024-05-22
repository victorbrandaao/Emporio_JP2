document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('users.json')
            .then(response => response.json())
            .then(data => {
                if (data[username] && data[username].password === password) {
                    sessionStorage.setItem('user', username);
                    window.location.href = 'dashboard.html'; // Redireciona para a página principal após o login
                } else {
                    showMessage('Credenciais inválidas', 'danger');
                }
            })
            .catch(error => {
                console.error('Erro ao realizar o login:', error);
                showMessage('Erro ao realizar o login', 'danger');
            });
    });
});

function showMessage(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;
    alertContainer.style.display = 'block';

    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 3000);
}
