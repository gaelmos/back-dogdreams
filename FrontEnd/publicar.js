document.getElementById('publishForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const breed = document.getElementById('breed').value;
    const birthdate = document.getElementById('birthdate').value;
    const color = document.getElementById('color').value;
    const size = document.getElementById('size').value;
    const difficulties = document.getElementById('difficulties').value;
    const description = document.getElementById('description').value;
    const photoFile = document.getElementById('photo').files[0];

    const reader = new FileReader();

    reader.onloadend = function() {
        const newDog = {
            name: name,
            breed: breed,
            birthdate: birthdate,
            color: color,
            size: size,
            difficulties: difficulties,
            description: description,
            img: reader.result  // Base64 string
        };

        // Guardar el nuevo perro en localStorage
        let dogs = JSON.parse(localStorage.getItem('dogs')) || [];
        dogs.push(newDog);
        localStorage.setItem('dogs', JSON.stringify(dogs));

        // Redirigir a la página principal
        window.location.href = 'pagina_principal.html';
    };

    if (photoFile) {
        reader.readAsDataURL(photoFile);
    }
});
