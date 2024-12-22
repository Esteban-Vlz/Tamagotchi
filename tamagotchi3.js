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
        throw new Error('Método alimentar debe implementarse');
    }

    jugar(tamagotchi) {
        throw new Error('Método jugar debe implementarse');
    }

    dormir(tamagotchi) {
        throw new Error('Método dormir debe implementarse');
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


class Critico extends Estado {
    alimentar(tamagotchi) {
        console.log(`${tamagotchi.nombre} está en un estado crítico, necesita atención urgente.`);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 20);
        tamagotchi.verificarEstado();
    }

    jugar(tamagotchi) {
        console.log(`${tamagotchi.nombre} no puede jugar en estado crítico.`);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
        tamagotchi.verificarEstado();
    }

    dormir(tamagotchi) {
        console.log(`${tamagotchi.nombre} necesita descansar urgentemente.`);
        tamagotchi.energia = Math.min(100, tamagotchi.energia + 20);
        tamagotchi.hambre = Math.min(100, tamagotchi.hambre + 15);
        if (tamagotchi.salud > 50) {
            tamagotchi.cambiarEstado(new Cansado());
        }
        tamagotchi.verificarEstado();
    }
}

class Muerto extends Estado {
    alimentar(tamagotchi) {
        console.log(`${tamagotchi.nombre} está muerto y no puede comer.`);
    }

    jugar(tamagotchi) {
        console.log(`${tamagotchi.nombre} está muerto y no puede jugar.`);
    }

    dormir(tamagotchi) {
        console.log(`${tamagotchi.nombre} está muerto y no puede dormir.`);
    }
}


class VisitanteMuerte {
    visitarHambre(tamagotchi) {}
    visitarSalud(tamagotchi) {}
    visitarFelicidad(tamagotchi) {}
    visitarEnergia(tamagotchi) {}
}

class MuertePorEstado extends VisitanteMuerte {
    visitarHambre(tamagotchi) {
        console.log(`${tamagotchi.nombre} ha fallecido por hambre extrema. 🍽️💀`);
        tamagotchi.vivo = false;
        tamagotchi.cambiarEstado(new Muerto);
    }

    visitarSalud(tamagotchi) {
        console.log(`${tamagotchi.nombre} ha fallecido por mala salud. 🤒💀`);
        tamagotchi.vivo = false;
        tamagotchi.cambiarEstado(new Muerto);
    }

    visitarFelicidad(tamagotchi) {
        console.log(`${tamagotchi.nombre} ha fallecido por tristeza extrema. 😭💀`);
        tamagotchi.vivo = false;
        tamagotchi.cambiarEstado(new Muerto);
    }

    visitarEnergia(tamagotchi) {
        console.log(`${tamagotchi.nombre} ha fallecido por agotamiento extremo. 😴💀`);
        tamagotchi.vivo = false;
        tamagotchi.cambiarEstado(new Muerto);
    }

    visitarEdad(tamagotchi) {
        console.log(`${tamagotchi.nombre} ha fallecido por muerte natural. 💀`);
        tamagotchi.vivo = false;
        tamagotchi.cambiarEstado(new Muerto);
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
            this.actualizarEstado();
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
            } else {
                this.estado.jugar(this);
            }
            this.verificarEstado();
            this.actualizarBarras();
            this.actualizarEstado();
        }
    }
    
    dormir() {
        if (this.vivo) {
            if (this.energia <= 20) {
                console.log(`${this.nombre} tiene poca energía y está durmiendo por 5 minutos.`);
                this.cambiarAnimacion('durmiendo');  // Cambiar a la animación de dormir
                this.estado.dormir(this);
                this.temporizadorDescanso = setInterval(() => {
                    if (this.energia < 100) {
                        this.energia += 5;  // Recuperar energía
                        this.actualizarBarras();
                        console.log(`${this.nombre} está descansando, energía actual: ${this.energia}`);
                    }
                    if (this.energia >= 100) {
                        clearInterval(this.temporizadorDescanso);  // Detener el temporizador al llegar a 100 de energía
                        this.cambiarEstado(new Feliz());  // Cambiar estado a Feliz cuando se recupere la energía
                        this.wakeUp();
                    }
                }, 60000);  // 1 minuto de descanso por cada ciclo
            } else {
                console.log(`${this.nombre} dice: No estoy cansado jefe`);
                this.verificarEstado();
                this.actualizarBarras();
                this.actualizarEstado();
            }
        }
    }
    
    
    wakeUp() {
        console.log(`${this.nombre} se ha despertado después de descansar.`);
        this.cambiarAnimacion('feliz');  // Cambiar a la animación de feliz
        this.verificarEstado();
        this.actualizarBarras();
    }
    

    cambiarEstado(nuevoEstado) {
        if(this.vivo){
        this.estado = nuevoEstado;
        console.log(`${this.nombre} ahora está en estado: ${nuevoEstado.constructor.name}`);}
    }

    
    aceptar(visitante) {
        // Lista de estados con valores actuales y métodos correspondientes
        const estados = [
            { valor: this.hambre, metodo: () => visitante.visitarHambre(this), critico: 100 },
            { valor: this.salud, metodo: () => visitante.visitarSalud(this), critico: 0 },
            { valor: this.felicidad, metodo: () => visitante.visitarFelicidad(this), critico: 0 },
            { valor: this.energia, metodo: () => visitante.visitarEnergia(this), critico: 0 },
            { valor: this.edad, metodo: () => visitante.visitarEdad(this), critico: 50 }
        ];

        // Ordenar por cercanía al estado crítico
        estados.sort((a, b) => {
            const diferenciaA = Math.abs(a.valor - a.critico);
            const diferenciaB = Math.abs(b.valor - b.critico);
            return diferenciaA - diferenciaB; // Prioriza el estado más crítico
        });

        // Ejecutar el primer estado crítico encontrado
        for (let estado of estados) {
            if ((estado.critico === 100 && estado.valor >= 100) || 
                (estado.critico === 0 && estado.valor <= 0)) {
                estado.metodo();
                break;
            }
        }
    }

    verificarEstado(visitante) {
        if (this.vivo) {
            const visitante = new MuertePorEstado();
            this.aceptar(visitante);
        }
    }

    incrementarEdad() {
        if (this.vivo) {
            this.edad += 1;
            if (this.edad >= 100) {
                this.verificarEstado(this);}
        }
    }

    actualizarEstado() {
        // Lista de reglas con prioridades
        const reglas = [
            { condicion: () => this.felicidad <= 20 || this.salud < 30 || this.aburrimiento >= 50, estado: new Critico() },
            { condicion: () => this.hambre >= 50, estado: new Hambriento() },
            { condicion: () => this.energia <= 30, estado: new Cansado() },
            { condicion: () => true, estado: new Feliz() }, 
        ];

        // Buscar la primera regla que se cumple y cambiar el estado
        for (const regla of reglas) {
            if (regla.condicion()) {
                this.cambiarEstado(regla.estado);
                break; // Rompe el bucle al encontrar la regla más crítica
            }
        }
    }

    iniciarTemporizadores(){
        this.temporizador = setInterval(() => {
            if (this.vivo) { 
                if (this.hambre < 100) this.hambre += 10;
                if (this.energia > 0) this.energia -= 10;
                if (this.salud > 0 && this.energia <= 20) this.salud -= 0.5;
                this.actualizarBarras();
            } else {
                this.detenerTemporizador();  
            }
        }, 60000);  
    }
    

    actualizarBarras(){
        this.observadores.hambre.actualizar(this.hambre);
        this.observadores.felicidad.actualizar(this.felicidad);
        this.observadores.energia.actualizar(this.energia);
        this.observadores.salud.actualizar(this.salud);
        this.observadores.aburrimiento.actualizar(this.aburrimiento);
    }

    detenerTemporizador(){
        if (!this.vivo) {
            clearInterval(this.temporizador);  
        }
        
    }

    cambiarAnimacion(cadena) {
        const video = document.getElementById('tamagotchi-video');
        switch (cadena) {
            case 'feliz':
                video.src = 'Feliz.mp4';  // Video cuando está feliz
                break;
            case 'hambriento':
                video.src = 'Hambriento.mp4';  // Video cuando tiene hambre
                break;
            case 'cansado':
                video.src = 'Cansado.mp4';  // Video cuando está cansado
                break;
            case 'jugar':
                video.src = 'Jugar.mp4';  // Video cuando juega
                break;
            case 'dormir':
                video.src = 'Dormir.mp4';  // Video cuando duerme
                break;
            case 'triste':
                video.src = 'Triste.mp4'
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
