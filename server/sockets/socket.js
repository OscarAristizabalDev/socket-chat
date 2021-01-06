const { io } = require('../server');
const { Usuario } = require('../classes/usuario');
const { crearMensaje } = require('../utilidades/utilidades');

const usuario = new Usuario();

io.on('connection', (client) => {

    // Se realiza la conexión con el cliente en donde se recibe la persona o cliente para el chat
    client.on('entrarChat', (data, callback) => {

        // Se valida que dentro de los datos de la persona o usuario venga la variable nombre y sala
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'EL nombre y sala son necesarios'
            });
        }
        // Se especifica a que sala se va a conectar el usuario
        client.join(data.sala);
        // Se agrega una nueva persona al chat
        // Se le envia el id unico, el nombre del usuario y el nombre de la sala al que se va a conectar
        usuario.agregarPersona(client.id, data.nombre, data.sala);
        // Cuando una persona ingresa al chat, se emite el evento a todos los clientes conectados a la sala
        // y se envia el listado de personas conectadas a la sala
        client.broadcast.to(data.sala).emit('listaPersona', usuario.getPersonasPorSala(data.sala));
        // Se retonar al cliente las personas ingresadas al chat de una misma sala
        callback(usuario.getPersonasPorSala(data.sala));
    });

    // El servidor recibe cualquie mensaje enviado por cualquier cliente
    client.on('crearMensaje', (data) => {
        // Se obtiene la persona que esta enviado el mensaje
        let persona = usuario.getPersona(client.id);
        // Se crea el mensaje
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        // Se el envia el mensaje a todos los clientes conectados en una misma sala
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    // 
    client.on('disconnect', () => {
        // Se borra el usuario o persona cuando el cliente desconectan del servidor
        let clienteBorrado = usuario.borrarPersona(client.id);
        // Se notifica a todos los usuarios de la sala, la persona que salio del chat
        client.broadcast.to(clienteBorrado.sala).emit('crearMensaje', crearMensaje('Administrador', `${clienteBorrado.nombre} salio`));
        // Cuando una persona sale del chat, se emite el evento a todos los clientes conectados a la misma sala
        // y se envia el listado de personas conectadas a la misma sala
        client.broadcast.to(clienteBorrado.sala).emit('listaPersona', usuario.getPersonasPorSala(clienteBorrado.sala));

    });

    //mensajes privados
    // accion del cliente que va a estar escuchando los mensaje privados que se envian
    client.on('mensajePrivado', data => {
        // Se obtiene la persona que esta enviando el mensaje
        let persona = usuario.getPersona(client.id);
        // Se envia el mensaje privado al destinatario especifico
        client.broadcast.to(data.destinatario).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

});