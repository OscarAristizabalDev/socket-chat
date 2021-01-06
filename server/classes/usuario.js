class Usuario {
    constructor() {
        this.personas = [];
    }

    /**
     * Funcion que permite agregar una nueva persona al arreglo de personas
     * @param {*} id 
     * @param {*} nombre 
     */
    agregarPersona(id, nombre, sala) {
        // Se instacion una nuvea persona
        let persona = { id, nombre, sala };
        // Se registra la persona en el arreglo de persona
        this.personas.push(persona);
        return this.personas;
    }

    /**
     * Permite buscar una persona por ID
     * @param {*} id 
     */
    getPersona(id) {

        // Funcion filtre permite buscar registros en arreglos en javascript
        // la cual retorna otra arreglo diferente
        // Pero en este caso solo obtenemos la persona de la posicion 0
        let persona = this.personas.filter(persona => {
            return persona.id === id;
        })[0];

        return persona;
    }

    /**
     * Trae todas las personas
     */
    getPersonas() {
            return this.personas;
        }
        /**
         * Funcion que permite obtener todas las personas de una misma sala
         * @param {*} sala 
         */
    getPersonasPorSala(sala) {
        let personasSala = this.personas.filter(persona => persona.sala === sala);
        return personasSala;
    }

    /**
     * Funcion que permite borrar una persona
     * @param {} id 
     */
    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);
        // la funciona filter permite buscar datos en arreglo de javascript
        this.personas = this.personas.filter(persona => {
            // Solo se retornan las personas cuyo id sean diferente al de la persona que se pretende eliminar.
            return persona.id != id
        });

        return personaBorrada;
    }
}

module.exports = {
    Usuario
}