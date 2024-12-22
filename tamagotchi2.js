class Observer {
    constructor(barra) {
        this.barra = barra;
    }

    actualizar(valor) {
        this.barra.style.width = `${valor}%`;
    }
}

class Estado {
    alimentar(tamagotchi) {
        throw new Error('Método "alimentar" debe ser implementado');
    }

    jugar(tamagotchi) {
        throw new Error('Método "jugar" debe ser implementado');
    }

    dormir(tamagotchi) {
        throw new Error('Método "dormir" debe ser implementado');
    }
}

class Feliz extends Estado {
    alimentar(tamagotchi) {
        tamagotchi.felicidad = Math.min(100, tamagotchi.felicidad + 5);
        const hambreReducida = Math.min(10, tamagotchi.hambre);
        tamagotchi.hambre -= hambreReducida;
        console.log(`${tamagotchi.nombre} está siendo alimentado. Hambre reducida en ${hambreReducida}. Hambre actual: ${tamagotchi.hambre}`);
    }

    jugar(tamagotchi) {
        tamagotchi.felicidad = Math.min(100, tamagotchi.felicidad + 5);
        tamagotchi.aburrimiento = Math.max(0, tamagotchi.aburrimiento - 20);
        tamagotchi.energia = Math.max(0, tamagotchi.energia - 20);
        tamagotchi.hambre = Math.min(100, tamagotchi.hambre + 10);
        console.log(`${tamagotchi.nombre} está jugando. Aburrimiento: ${tamagotchi.aburrimiento}, Energía: ${tamagotchi.energia}`);
    }

    dormir(tamagotchi) {
        console.log(`No estoy cansado, déjame jugar un poco más.`);
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 10);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 10);
    }
}

class Hambriento extends Estado {
    alimentar(tamagotchi) {
        const hambreReducida = Math.min(20, tamagotchi.hambre);
        tamagotchi.hambre -= hambreReducida;
        tamagotchi.felicidad = Math.min(100, tamagotchi.felicidad + 10);
        console.log(`${tamagotchi.nombre} está siendo alimentado. Hambre reducida en ${hambreReducida}. Hambre actual: ${tamagotchi.hambre}`);

        if (tamagotchi.hambre < 30) {
            tamagotchi.cambiarEstado(new Feliz());
        }
    }

    jugar(tamagotchi) {
        console.log('No estoy aburrido, tengo hambre.');
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 30);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
    }

    dormir(tamagotchi) {
        console.log('No estoy cansado, tengo hambre.');
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 10);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
    }
}

class Cansado extends Estado {
    dormir(tamagotchi) {
        tamagotchi.energia = Math.min(100, tamagotchi.energia + 30);
        console.log(`${tamagotchi.nombre} está durmiendo. Energía: ${tamagotchi.energia}`);
        tamagotchi.hambre = Math.min(100, tamagotchi.hambre + 10);

        if (tamagotchi.energia > 50) {
            tamagotchi.cambiarEstado(new Feliz());
        }
    }

    alimentar(tamagotchi) {
        console.log(`${tamagotchi.nombre} está demasiado cansado para comer.`);
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 30);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
    }

    jugar(tamagotchi) {
        console.log(`${tamagotchi.nombre} está demasiado cansado para jugar.`);
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 30);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
    }
}

class MuerteEstrategia {
    ejecutar(tamagotchi, razon) {
        console.log(`${tamagotchi.nombre} ha fallecido debido a: ${razon}. Fin del juego.`);
        tamagotchi.vivo = false;
    }
}

class Tamagotchi {
    constructor(nombre) {
        this.nombre = nombre;
        this.hambre = 0;
        this.aburrimiento = 0;
        this.energia = 100;
        this.felicidad = 100;
        this.salud = 100;
        this.edad = 0;
        this.estado = new Feliz();
        this.vivo = true;
        this.muerteEstrategia = new MuerteEstrategia();

        // Observadores
        this.observadores = {
            hambre: new Observer(document.getElementById('barra-hambre')),
            felicidad: new Observer(document.getElementById('barra-felicidad')),
            energia: new Observer(document.getElementById('barra-energia')),
            salud: new Observer(document.getElementById('barra-salud')),
            aburrimiento: new Observer(document.getElementById('barra-aburrimiento'))
        };

        // Iniciar temporizador para hambre y cansancio
        this.iniciarTemporizadores();
    }

    alimentar() {
        if (this.vivo) {
            if (this.hambre === 0) {
                console.log(`El Tamagotchi ${this.nombre} está lleno, no puede comer más.`);
            } else {
                this.estado.alimentar(this);
            }
            this.verificarEstado();
            this.actualizarBarras();
        }
    }

    jugar() {
        if (this.vivo) {
            if (this.energia <= 20) {
                console.log(`El Tamagotchi ${this.nombre} está demasiado cansado y no puede jugar.`);
                this.felicidad = Math.max(0, this.felicidad - 10);
                this.salud = Math.max(0, this.salud - 30);
                this.hambre = Math.min(100, this.hambre + 15);
                this.energia = Math.max(0, this.energia - 20);
                this.cambiarEstado(new Cansado());
                return;
            }
            this.estado.jugar(this);
            this.verificarEstado();
            this.actualizarBarras();
        }
    }

    dormir() {
        if (this.vivo) {
            if (this.energia <= 20) {
                console.log(`${this.nombre} tiene poca energía y está durmiendo por 5 minutos.`);
                this.estado.dormir(this);
                setTimeout(() => this.wakeUp(), 300000);
            } else {
                console.log(`${this.nombre} dice: No estoy cansado jefe`);
            }
            this.verificarEstado();
            this.actualizarBarras();
        }
    }

    wakeUp() {
        console.log(`${this.nombre} se ha despertado después de descansar.`);
        this.verificarEstado();
        this.actualizarBarras();
    }

    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
        console.log(`${this.nombre} ahora está en estado: ${nuevoEstado.constructor.name}`);
    }

    verificarEstado() {
        if (this.hambre >= 100) {
            this.muerteEstrategia.ejecutar(this, 'hambre extrema');
        } else if (this.salud <= 0) {
            this.muerteEstrategia.ejecutar(this, 'mala salud');
        } else if (this.felicidad <= 0) {
            this.muerteEstrategia.ejecutar(this, 'tristeza extrema');
        } else if (this.energia <= 0) {
            this.muerteEstrategia.ejecutar(this, 'agotamiento extremo');
        }
    }

    incrementarEdad() {
        if (this.vivo) {
            this.edad += 1;
            if (this.edad >= 100) {
                this.muerteEstrategia.ejecutar(this, 'su edad')}
        }
    }

    iniciarTemporizadores(){
        setInterval(()=>{
            if(this.hambre <100) this.hambre+=10;
            if(this.energia >0) this.energia -=10;
            if(this.salud >0 && this.energia <=20) this.salud -= 0.5;       
            this.actualizarBarras();
        },60000);
    }

    actualizarBarras(){
        this.observadores.hambre.actualizar(this.hambre);
        this.observadores.felicidad.actualizar(this.felicidad);
        this.observadores.energia.actualizar(this.energia);
        this.observadores.salud.actualizar(this.salud);
        this.observadores.aburrimiento.actualizar(this.aburrimiento);
    }

    cambiarAnimacion(estado) {
        const video = document.getElementById('tamagotchi-video');
        switch (estado) {
            case 'feliz':
                video.src = 'feliz.mp4';  // Video cuando está feliz
                break;
            case 'hambriento':
                video.src = 'hambriento.mp4';  // Video cuando tiene hambre
                break;
            case 'cansado':
                video.src = 'cansado.mp4';  // Video cuando está cansado
                break;
            case 'jugando':
                video.src = 'jugando.mp4';  // Video cuando juega
                break;
            case 'durmiendo':
                video.src = 'durmiendo.mp4';  // Video cuando duerme
                break;
            case 'muerto':
                video.src = 'muerto.mp4';  // Video cuando muere
                break;
            default:
                video.src = '';  // Vacío si no hay animación
                break;
        }
        video.play();
    }
}
const tamagotchi = new Tamagotchi("Mingi");
