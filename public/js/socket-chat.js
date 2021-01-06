var socket = io();

// Variable para almacenar los datos ingresados por la url
var params = new URLSearchParams(window.location.search);
// En caso de que no venga el nombre del usuario y la sala
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

// Si viene la variable nombre, se crea el usuario
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

// Una vez se realiza la coneccion con el servidor
socket.on('connect', function() {
    console.log('Conectado al servidor');
    // Se envia el usuario al servidor, y se revise la respuesta del servidor
    // la respuesta del servidor es sobre lo usuarios conectados
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('usuarios conectados', resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/**', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});*/

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});


// Escuchar cambios de usuarios
// cuando un usuario ingresa o sale del chat
socket.on('listaPersona', function(personas) {

    console.log('Servidor:', personas);

});

// mensajes privados
// acción para escuchar al servidor y enviarse a la persona privada
socket.on('mensajePrivado', function(mensaje) {
    console.log('mensaje privado: ', mensaje);
})