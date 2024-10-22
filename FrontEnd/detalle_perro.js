document.addEventListener('DOMContentLoaded', function() {
    const dog = JSON.parse(localStorage.getItem('selectedDog'));

    if (dog) {
        document.getElementById('dogImage').src = dog.img;
        document.getElementById('dogName').textContent = dog.name;
        document.getElementById('dogBreed').textContent = dog.breed;
        document.getElementById('dogBirthdate').textContent = dog.birthdate;
        document.getElementById('dogColor').textContent = dog.color;
        document.getElementById('dogSize').textContent = dog.size;
        document.getElementById('dogDifficulties').textContent = dog.difficulties || 'Ninguna';
        document.getElementById('dogDescription').textContent = dog.description;
    } else {
        document.body.innerHTML = '<p>No se encontró la información del perro.</p>';
    }

    // Manejar el clic en el botón de Adoptar
    const adoptBtn = document.getElementById('adoptBtn');
    const contactInfo = document.getElementById('contactInfo');

    adoptBtn.addEventListener('click', function() {
        contactInfo.style.display = 'block';
    });
});
