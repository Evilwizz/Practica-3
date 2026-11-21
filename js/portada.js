// Estado Portada - Menú Principal del Juego
var Portada = {
    preload: function() {
        juego.load.image('bg', 'img/bg.png');
        juego.load.image('carro', 'img/carro.png');
        juego.load.image('carroMalo', 'img/carroMalo.png');
        juego.load.image('carroMalo1', 'img/carroMalo1.png');
        juego.load.image('gasolina', 'img/gas.png');
        juego.load.spritesheet('explosion', 'img/explosion.png', 54, 56, 8);
        juego.forceSingleUpdate = true;
    },

    create: function() {
        this.fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');

        var overlay = juego.add.graphics(0, 0);
        overlay.beginFill(0x0a0f1d, 0.85);
        overlay.drawRect(0, 0, 290, 540);
        overlay.endFill();

        var tituloStyle = { font: 'bold 22px "Arial Black", Arial', fill: '#00e5ff', align: 'center', stroke: '#000000', strokeThickness: 5 };
        var titulo = juego.add.text(juego.width / 2, 45, 'TURBO RACER 2D', tituloStyle);
        titulo.anchor.setTo(0.5);

        var subStyle = { font: 'bold 12px Arial', fill: '#ffeb3b', align: 'center' };
        var subtitulo = juego.add.text(juego.width / 2, 72, 'PC3 - DESARROLLO DE VIDEOJUEGOS', subStyle);
        subtitulo.anchor.setTo(0.5);

        this.carroDemo = juego.add.sprite(juego.width / 2, 130, 'carro');
        this.carroDemo.anchor.setTo(0.5);
        this.carroDemo.scale.setTo(1.3);

        this.carroMaloDemo = juego.add.sprite(60, 130, 'carroMalo');
        this.carroMaloDemo.anchor.setTo(0.5);
        this.carroMaloDemo.scale.setTo(1.1);

        this.carroMalo2Demo = juego.add.sprite(230, 130, 'carroMalo1');
        this.carroMalo2Demo.anchor.setTo(0.5);
        this.carroMalo2Demo.scale.setTo(1.1);

        // Tarjeta con Nombre y Apellido del Estudiante
        var nombreActual = window.getNombreJugador ? window.getNombreJugador() : 'Aldair Jose Lozano Santiago';
        
        var boxNombre = juego.add.graphics(15, 175);
        boxNombre.beginFill(0x1e293b, 0.95);
        boxNombre.lineStyle(2, 0x38bdf8, 1);
        boxNombre.drawRoundedRect(0, 0, 260, 68, 8);
        boxNombre.endFill();

        var lblPiloto = juego.add.text(juego.width / 2, 192, 'PILOTO / ESTUDIANTE:', { font: 'bold 10px Arial', fill: '#94a3b8' });
        lblPiloto.anchor.setTo(0.5);

        this.txtNombre = juego.add.text(juego.width / 2, 218, nombreActual, { font: 'bold 13px Arial', fill: '#38bdf8', stroke: '#000', strokeThickness: 2 });
        this.txtNombre.anchor.setTo(0.5);

        // Reglas resumidas
        var reglasBox = juego.add.graphics(15, 255);
        reglasBox.beginFill(0x0f172a, 0.9);
        reglasBox.lineStyle(1, 0x475569, 1);
        reglasBox.drawRoundedRect(0, 0, 260, 155, 8);
        reglasBox.endFill();

        var infoTitle = juego.add.text(juego.width / 2, 270, 'OBJETIVOS & NIVELES', { font: 'bold 11px Arial', fill: '#f59e0b' });
        infoTitle.anchor.setTo(0.5);

        var reglasTxt = 
            '❤️ Vidas iniciales: 3 Vidas\n' +
            '🛢️ Recoge Gasolina: +1 Punto\n' +
            '⚠️ Esquiva Obstáculos: -1 Vida\n' +
            '------------------------------------\n' +
            '🚩 Nivel 1: Junta 3 barriles\n' +
            '🚀 Nivel 2: Nuevos autos veloces\n' +
            '🏆 Junta 6 puntos para GANAR';
        
        var info = juego.add.text(25, 290, reglasTxt, { font: '11px Arial', fill: '#e2e8f0', lineSpacing: 4 });

        // Botón INICIAR JUEGO
        var btnGrafico = juego.add.graphics(0, 0);
        btnGrafico.beginFill(0x10b981);
        btnGrafico.lineStyle(2, 0x34d399, 1);
        btnGrafico.drawRoundedRect(35, 435, 220, 48, 10);
        btnGrafico.endFill();

        var btnTexto = juego.add.text(juego.width / 2, 459, '⚡ INICIAR JUEGO ⚡', { font: 'bold 16px "Arial Black", Arial', fill: '#ffffff', stroke: '#064e3b', strokeThickness: 3 });
        btnTexto.anchor.setTo(0.5);

        var hitArea = new Phaser.Rectangle(35, 435, 220, 48);
        juego.input.onDown.add(function(pointer) {
            if (hitArea.contains(pointer.x, pointer.y)) {
                Portada.iniciarJuego();
            }
        });

        this.espacioKey = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.enterKey = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        var pressStart = juego.add.text(juego.width / 2, 502, 'Presiona ENTER o Toca el Botón', { font: '11px Arial', fill: '#94a3b8' });
        pressStart.anchor.setTo(0.5);
        juego.add.tween(pressStart).to({ alpha: 0.3 }, 600, Phaser.Easing.Linear.None, true, 0, -1, true);
    },

    update: function() {
        this.fondo.tilePosition.y += 1;
        
        var time = juego.time.totalElapsedSeconds();
        this.carroDemo.y = 130 + Math.sin(time * 3) * 3;
        this.carroMaloDemo.y = 130 + Math.cos(time * 2.5) * 4;
        this.carroMalo2Demo.y = 130 + Math.sin(time * 2.8) * 4;

        if (this.espacioKey.isDown || this.enterKey.isDown) {
            this.iniciarJuego();
        }
    },

    actualizarNombre: function(nuevoNombre) {
        if (this.txtNombre) {
            this.txtNombre.text = nuevoNombre;
        }
    },

    iniciarJuego: function() {
        Sonidos.playGasolina();
        Sonidos.playBGM();
        juego.state.start('Juego', true, false, { vidas: 3, puntos: 0, nivel: 1 });
    }
};
