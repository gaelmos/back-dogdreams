document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor, ingrese su correo electrónico y contraseña.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/inicio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mail: email, contraseña: password })
        });

        if (response.ok) {
            alert('Inicio de sesión exitoso');
            window.location.href = 'pagina_principal.html';
        } else {
            alert('Correo o contraseña incorrectos. Intente de nuevo.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Inténtelo de nuevo más tarde.');
    }
});

// Botón de registrarse redirige al formulario de registro
document.getElementById('registerBtn').addEventListener('click', function() {
    window.location.href = 'pagina_registro.html'; // Redirige a la página de registro
});