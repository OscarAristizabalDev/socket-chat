var socket = io();

var params = new URLSearchParams(window.location.search);

// Se valida que si venga el nombre y la salda desde el formulario
// en caso tal de que no se regresa al index
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

// se crea un objeto usuario con los datos recibidos
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};


// Escucha cuando se realiza la conexion con el servidor
socket.on('connect', function() {
    console.log('Conectado al servidor');
    // Se le emite al servidor que el usuario entro al chat
    socket.emit('entrarChat', usuario, function(resp) {
        // y se renderiza el nuevo usuario que ingreso, y se muestra en el chat.html
        renderizarUsuarios(resp);
    });

});

// escuchar cuando se pierde la conexion
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    //console.log('Servidor:', mensaje);
    // Se renderiza el mensaje y se envia false dado que lo esta recibiendo o soy yo quien lo recibe
    renderizarMensajes(mensaje, false);
    scrollBottom();
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {
    renderizarUsuarios(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado:', mensaje);

});