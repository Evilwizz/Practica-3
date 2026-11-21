// ==========================================
// ARCHIVO PRINCIPAL - INICIALIZACIÓN DE PHASER
// ==========================================

// Creación del juego con dimensiones 290 x 540 según especificación UTP
var juego = new Phaser.Game(290, 540, Phaser.CANVAS, 'runner');

// Registro de los 5 estados del juego
juego.state.add('Portada', Portada);
juego.state.add('Juego', Juego);         // Nivel 1
juego.state.add('Nivel2', Nivel2);       // Nivel 2
juego.state.add('Ganaste', Ganaste);     // Victoria ("GANASTE")
juego.state.add('Terminado', Terminado); // Derrota ("VUELVE A INTENTARLO")

// Soporte de parámetros por URL para previsualización directa y capturas
var urlParams = new URLSearchParams(window.location.search);
var paramNombre = urlParams.get('nombre');
if (paramNombre && paramNombre.trim() !== '') {
    window.setNombreJugador(paramNombre.trim());
} else if (window.getNombreJugador) {
    var actual = window.getNombreJugador();
    if (actual === 'Estudiante UTP') {
        window.setNombreJugador('Aldair Jose Lozano Santiago');
    }
}

var estadoInicial = urlParams.get('estado') || 'Portada';

// Iniciar en el estado correspondiente
if (estadoInicial === 'Juego' || estadoInicial === 'Nivel1') {
    juego.state.start('Juego', true, false, { vidas: 3, puntos: 1, nivel: 1 });
} else if (estadoInicial === 'Nivel2') {
    juego.state.start('Nivel2', true, false, { vidas: 3, puntos: 4, nivel: 2 });
} else if (estadoInicial === 'Ganaste') {
    juego.state.start('Ganaste', true, false, { vidas: 2, puntos: 6 });
} else if (estadoInicial === 'Terminado') {
    juego.state.start('Terminado', true, false, { vidas: 0, puntos: 2, nivel: 1 });
} else {
    juego.state.start('Portada');
}
