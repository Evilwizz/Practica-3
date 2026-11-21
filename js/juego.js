// ==========================================
// ESTADO: JUEGO (NIVEL 1)
// ==========================================
var fondo;
var carro;
var cursores;
var teclaA;
var teclaD;
var enemigos;
var gasolinas;
var timer;
var timerGasolina;

var vidas = 3;
var puntos = 0;
var nivel = 1;
var metaNivel1 = 3;

var hudVidas;
var hudPuntos;
var hudNivel;
var hudNombre;
var estaInvulnerable = false;
var nivelCompletado = false;

var Juego = {
    init: function (datos) {
        vidas = (datos && typeof datos.vidas !== 'undefined') ? datos.vidas : 3;
        puntos = (datos && typeof datos.puntos !== 'undefined') ? datos.puntos : 0;
        nivel = 1;
        nivelCompletado = false;
        estaInvulnerable = false;
    },

    preload: function () {
        juego.load.image('bg', 'img/bg.png');
        juego.load.image('carro', 'img/carro.png');
        juego.load.image('carroMalo', 'img/carroMalo.png');
        juego.load.image('gasolina', 'img/gas.png');
        juego.load.spritesheet('explosion', 'img/explosion.png', 54, 56, 8);
        juego.forceSingleUpdate = true;
    },

    create: function () {
        juego.physics.startSystem(Phaser.Physics.ARCADE);

        // Fondo scrollable
        fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');

        // Carro del jugador centrado en x=145, y=496
        carro = juego.add.sprite(juego.width / 2, 496, 'carro');
        carro.anchor.setTo(0.5);
        juego.physics.arcade.enable(carro);
        carro.body.collideWorldBounds = true;
        carro.body.setSize(22, 38, 4, 3);

        // Grupo de carros enemigos (Nivel 1: carroMalo)
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;
        enemigos.createMultiple(25, 'carroMalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.forEach(function (e) {
            e.body.setSize(24, 36, 3, 2);
        });

        // Grupo de barriles de gasolina
        gasolinas = juego.add.group();
        gasolinas.enableBody = true;
        gasolinas.physicsBodyType = Phaser.Physics.ARCADE;
        gasolinas.createMultiple(25, 'gasolina');
        gasolinas.setAll('anchor.x', 0.5);
        gasolinas.setAll('anchor.y', 0.5);
        gasolinas.forEach(function (g) {
            g.body.setSize(20, 30, 2, 3);
        });

        // Generar inmediatamente el primer enemigo y la primera gasolina
        this.crearCarroMalo();
        this.crearGasolina();

        // Temporizadores continuos e infinitos para la aparición de obstáculos y gasolina
        timer = juego.time.events.loop(1400, this.crearCarroMalo, this);
        timerGasolina = juego.time.events.loop(2000, this.crearGasolina, this);

        cursores = juego.input.keyboard.createCursorKeys();
        teclaA = juego.input.keyboard.addKey(Phaser.Keyboard.A);
        teclaD = juego.input.keyboard.addKey(Phaser.Keyboard.D);

        this.crearHUD();
        Sonidos.playBGM();
        this.mostrarBannerNivel('🏁 NIVEL 1 🏁\nRecolecta 3 Barriles');
    },

    crearHUD: function () {
        var hudBg = juego.add.graphics(0, 0);
        hudBg.beginFill(0x0a0f1d, 0.9);
        hudBg.drawRect(0, 0, 290, 52);
        hudBg.lineStyle(2, 0x38bdf8, 0.8);
        hudBg.moveTo(0, 52);
        hudBg.lineTo(290, 52);
        hudBg.endFill();

        var nombreActual = window.getNombreJugador ? window.getNombreJugador() : 'Aldair Jose Lozano Santiago';
        hudNombre = juego.add.text(8, 7, 'PILOTO: ' + nombreActual, {
            font: 'bold 9.5px Arial',
            fill: '#38bdf8'
        });

        hudNivel = juego.add.text(225, 7, 'NIVEL 1', {
            font: 'bold 10px Arial',
            fill: '#facc15'
        });

        hudVidas = juego.add.text(10, 26, this.obtenerCorazones(vidas), {
            font: '13px Arial',
            fill: '#ef4444'
        });

        hudPuntos = juego.add.text(190, 26, '🛢️ ' + puntos + ' / ' + metaNivel1, {
            font: 'bold 13px Arial',
            fill: '#10b981'
        });
    },

    obtenerCorazones: function (cant) {
        var str = '';
        for (var i = 0; i < cant; i++) str += '❤️';
        if (cant <= 0) str = '💀 0';
        return str;
    },

    actualizarHUD: function () {
        if (hudVidas) hudVidas.text = this.obtenerCorazones(vidas);
        if (hudPuntos) hudPuntos.text = '🛢️ ' + puntos + ' / ' + metaNivel1;
        if (hudNombre) {
            var n = window.getNombreJugador ? window.getNombreJugador() : 'Aldair Jose Lozano Santiago';
            hudNombre.text = 'PILOTO: ' + n;
        }
    },

    mostrarBannerNivel: function (texto) {
        var bannerBg = juego.add.graphics(0, 0);
        bannerBg.beginFill(0x000000, 0.85);
        bannerBg.drawRect(0, 215, 290, 75);
        bannerBg.endFill();

        var bannerTxt = juego.add.text(juego.width / 2, 252, texto, {
            font: 'bold 15px Arial',
            fill: '#facc15',
            align: 'center',
            stroke: '#000',
            strokeThickness: 3
        });
        bannerTxt.anchor.setTo(0.5);

        juego.time.events.add(1500, function () {
            juego.add.tween(bannerBg).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
            juego.add.tween(bannerTxt).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true).onComplete.add(function () {
                bannerBg.destroy();
                bannerTxt.destroy();
            });
        });
    },

    update: function () {
        if (nivelCompletado) return;

        fondo.tilePosition.y += 3;

        var moverDerecha = cursores.right.isDown || teclaD.isDown || (window.touchRight === true);
        var moverIzquierda = cursores.left.isDown || teclaA.isDown || (window.touchLeft === true);

        if (moverDerecha && carro.position.x < 245) {
            carro.position.x += 5;
        } else if (moverIzquierda && carro.position.x > 45) {
            carro.position.x -= 5;
        }

        // LIMPIEZA AUTOMÁTICA Y RECICLAJE cuando salen por la parte inferior de la pantalla
        enemigos.forEachAlive(function (enemigo) {
            if (enemigo.y > 545) {
                enemigo.kill();
            }
        });

        gasolinas.forEachAlive(function (gasolina) {
            if (gasolina.y > 545) {
                gasolina.kill();
            }
        });

        // Detección de Colisiones
        juego.physics.arcade.overlap(carro, gasolinas, this.recogerGasolina, null, this);
        if (!estaInvulnerable) {
            juego.physics.arcade.overlap(carro, enemigos, this.chocarCarroMalo, null, this);
        }
    },

    crearCarroMalo: function () {
        if (nivelCompletado) return;
        var carril = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3
        var enemigo = enemigos.getFirstDead();
        if (!enemigo) {
            enemigo = enemigos.create(carril * 73, 0, 'carroMalo');
            juego.physics.arcade.enable(enemigo);
            enemigo.anchor.setTo(0.5);
            enemigo.body.setSize(24, 36, 3, 2);
        } else {
            enemigo.reset(carril * 73, 0);
        }
        enemigo.body.velocity.y = 200;
    },

    crearGasolina: function () {
        if (nivelCompletado) return;
        var carril = Math.floor(Math.random() * 3) + 1;
        var gasolina = gasolinas.getFirstDead();
        if (!gasolina) {
            gasolina = gasolinas.create(carril * 73, 0, 'gasolina');
            juego.physics.arcade.enable(gasolina);
            gasolina.anchor.setTo(0.5);
            gasolina.body.setSize(20, 30, 2, 3);
        } else {
            gasolina.reset(carril * 73, 0);
        }
        gasolina.body.velocity.y = 190;
    },

    recogerGasolina: function (c, gas) {
        gas.kill();
        puntos++;
        Sonidos.playGasolina();
        this.actualizarHUD();

        var efectoTxt = juego.add.text(c.x, c.y - 25, '+1 🛢️', {
            font: 'bold 15px Arial',
            fill: '#10b981',
            stroke: '#000',
            strokeThickness: 3
        });
        efectoTxt.anchor.setTo(0.5);
        juego.add.tween(efectoTxt).to({ y: c.y - 60, alpha: 0 }, 500, Phaser.Easing.Linear.None, true).onComplete.add(function () {
            efectoTxt.destroy();
        });

        if (puntos >= metaNivel1) {
            this.pasarAlNivel2();
        }
    },

    chocarCarroMalo: function (c, enemigo) {
        enemigo.kill();
        vidas--;
        Sonidos.playColision();
        this.actualizarHUD();

        var exp = juego.add.sprite(c.x, c.y, 'explosion');
        exp.anchor.setTo(0.5);
        exp.animations.add('boom');
        exp.animations.play('boom', 18, false, true);

        juego.camera.shake(0.015, 200);

        if (vidas <= 0) {
            this.perderJuego();
            return;
        }

        estaInvulnerable = true;
        var tween = juego.add.tween(carro).to({ alpha: 0.2 }, 120, Phaser.Easing.Linear.None, true, 0, 5, true);
        tween.onComplete.add(function () {
            carro.alpha = 1;
            estaInvulnerable = false;
        });
    },

    pasarAlNivel2: function () {
        nivelCompletado = true;
        juego.time.events.remove(timer);
        juego.time.events.remove(timerGasolina);
        enemigos.callAll('kill');
        gasolinas.callAll('kill');

        Sonidos.playVictoria();

        var cartel = juego.add.graphics(0, 0);
        cartel.beginFill(0x0f172a, 0.94);
        cartel.lineStyle(3, 0xf59e0b, 1);
        cartel.drawRoundedRect(20, 180, 250, 150, 10);
        cartel.endFill();

        var txt1 = juego.add.text(juego.width / 2, 215, '¡NIVEL 1 SUPERADO!', {
            font: 'bold 18px Arial',
            fill: '#10b981',
            stroke: '#000',
            strokeThickness: 3
        });
        txt1.anchor.setTo(0.5);

        var txt2 = juego.add.text(juego.width / 2, 250, '3 Puntos acumulados\nCargando Nivel 2...', {
            font: '13px Arial',
            fill: '#facc15',
            align: 'center'
        });
        txt2.anchor.setTo(0.5);

        var txt3 = juego.add.text(juego.width / 2, 295, '⚡ ¡Mayor Velocidad! ⚡', {
            font: 'bold 12px Arial',
            fill: '#ef4444'
        });
        txt3.anchor.setTo(0.5);

        juego.time.events.add(1800, function () {
            juego.state.start('Nivel2', true, false, { vidas: vidas, puntos: puntos });
        });
    },

    perderJuego: function () {
        nivelCompletado = true;
        juego.time.events.remove(timer);
        juego.time.events.remove(timerGasolina);
        Sonidos.stopBGM();
        Sonidos.playDerrota();

        juego.time.events.add(500, function () {
            juego.state.start('Terminado', true, false, {
                vidas: 0,
                puntos: puntos,
                nivel: 1
            });
        });
    }
};
