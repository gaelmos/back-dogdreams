async function cargarDatos() {
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);

    try {
        const response = await fetch('http://localhost:3000/perros', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Imagen y datos subidos correctamente');
        } else {
            alert('Error al subir los datos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al subir los datos');
    }
}
