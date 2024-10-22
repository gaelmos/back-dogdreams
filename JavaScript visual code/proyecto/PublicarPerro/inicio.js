// Obtener los elementos del formulario
const registerForm = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Función para iniciar sesión
async function iniciarSesion(email, contraseña) {
    try {
        const response = await fetch('http://localhost:3000/inicio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mail: email, contraseña: contraseña })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Has iniciado sesión correctamente');
            // Guardar el token en el almacenamiento local o en cookies
            localStorage.setItem('token', data.token);
            window.location.href = 'BusquedaPerro.html'; // Redirigir a la página de búsqueda de perros
        } else {
            const errorMessage = await response.text();
            alert(errorMessage); // Mostrar el mensaje de error
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Ocurrió un error al intentar iniciar sesión');
    }
}

// Función para redirigir al registro
function irARegistro() {
    window.location.href = 'crearcuenta2.html'; // Redirigir a la página de registro
}

// Escuchar el envío del formulario de inicio de sesión
registerForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar la recarga de la página al enviar el formulario
    const email = emailInput.value;
    const password = passwordInput.value;

    // Llamar a la función de iniciar sesión
    iniciarSesion(email, password);
});

// Manejo del botón "Registrarse"
const registrarseButton = document.querySelector('.Registrarse button');
registrarseButton.addEventListener('click', function(event) {
    event.preventDefault();
    irARegistro(); // Redirigir a la página de registro
});
