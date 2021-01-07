// Variable para almacenar los datos ingresados por la url
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

// Referecias de jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');


/**
 * Permite mostrar los usuarios conectados en la vista chat htmls
 * @param {*} personas 
 */
function renderizarUsuarios(personas) {

    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    // Se iteran los usuarios conectados
    for (let i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '    <a data-id=' + personas[i].id + ' href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }
    // Se envia la información al html
    divUsuarios.html(html);

}
/**
 * Funcion que permite renderizar los mensajes enviados en el chat, chat.html
 * @param {*} mensaje Recibe el mensaje enviado en el chat
 */
function renderizarMensajes(mensaje, yo) {

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// evento click cuando se selecciona un usuario de la sala de chat
divUsuarios.on('click', 'a', function() {
    // se guarda el id
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});
// evento submit para enviar un mensaje en el chat
formEnviar.on('submit', function(e) {
    e.preventDefault();
    // Se valida que el texto enviado si tenga caractares
    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    // Se emite la informacion al servido, en donde se envia el nombre del usuario y el mensaje
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        // se espera un callback con la respuesta del mensaje enviado
        txtMensaje.val('').focus();
        // y se renderiza o se muestra el mensaje en el chat y se envia true dado que soy yo quien lo envia
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });

});