document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const dni = document.getElementById('dni').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('password').value;
    const photoFile = document.getElementById('photo').files[0];

    const reader = new FileReader();

    reader.onloadend = async function() {
        const user = {
            nombre: fullName,
            mail: email,
            dni: dni,
            numero: phone,
            direccion: address,
            contraseña: password,
            foto: reader.result // Base64 string
        };

        try {
            const response = await fetch('https://vercel.com/gael-s-projects-4fcba6e9/back-dogdreams/BLKSwyTXkPJSeGSGQveoSegKqFmq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                console.log(user);
                alert('Usuario registrado con éxito');
                return window.location.href = 'pagina_principal.html';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
                console.log(error);
            }
        } catch (error) {
            console.log(error);
            alert('Error al registrarse. Inténtelo de nuevo más tarde.');
            return;
        }
    };

    if (photoFile) {
        reader.readAsDataURL(photoFile);
    }
});
