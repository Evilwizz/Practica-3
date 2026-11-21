// ==========================================
// ESTADO: GANASTE (VICTORIA)
// ==========================================
var Ganaste = {
    init: function(datos) {
        this.puntosFinales = (datos && typeof datos.puntos !== 'undefined') ? datos.puntos : 6;
        this.vidasFinales = (datos && typeof datos.vidas !== 'undefined') ? datos.vidas : 1;
    },

    preload: function() {
        juego.load.image('bg', 'img/bg.png');
        juego.load.image('carro', 'img/carro.png');
        juego.forceSingleUpdate = true;
    },

    create: function() {
        this.fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');

        var overlay = juego.add.graphics(0, 0);
        overlay.beginFill(0x064e3b, 0.90);
        overlay.drawRect(0, 0, 290, 540);
        overlay.endFill();

        var carroWin = juego.add.sprite(juego.width / 2, 75, 'carro');
        carroWin.anchor.setTo(0.5);
        carroWin.scale.setTo(1.6);
        juego.add.tween(carroWin.scale).to({ x: 1.8, y: 1.8 }, 600, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);

        // Cartel GANASTE
        var banner = juego.add.text(juego.width / 2, 140, '¡¡¡ GANASTE !!!', {
            font: 'bold 26px "Arial Black", Arial',
            fill: '#facc15',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 5
        });
        banner.anchor.setTo(0.5);
        juego.add.tween(banner.scale).to({ x: 1.08, y: 1.08 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

        var sub = juego.add.text(juego.width / 2, 175, '🏆 ¡JUEGO COMPLETADO AL 100%! 🏆', {
            font: 'bold 11px Arial',
            fill: '#34d399'
        });
        sub.anchor.setTo(0.5);

        // Tarjeta de resultados
        var card = juego.add.graphics(15, 200);
        card.beginFill(0x0f172a, 0.95);
        card.lineStyle(2, 0x10b981, 1);
        card.drawRoundedRect(0, 0, 260, 205, 10);
        card.endFill();

        var nombreActual = window.getNombreJugador ? window.getNombreJugador() : 'Aldair Jose Lozano Santiago';
        var txtNombre = juego.add.text(juego.width / 2, 230, 'CAMPEÓN / PILOTO:\n' + nombreActual, {
            font: 'bold 13px Arial',
            fill: '#38bdf8',
            align: 'center',
            stroke: '#000',
            strokeThickness: 2
        });
        txtNombre.anchor.setTo(0.5);

        var corazones = '';
        for (var i = 0; i < this.vidasFinales; i++) corazones += '❤️';

        var statsTxt = 
            '------------------------------------\n' +
            '🏁 Niveles Superados: 2 de 2\n' +
            '🛢️ Barriles Totales: ' + this.puntosFinales + ' / 6\n' +
            '❤️ Vidas Restantes: ' + corazones + '\n' +
            '⚡ Récord: Excelente Conducción\n' +
            '------------------------------------';

        var stats = juego.add.text(juego.width / 2, 335, statsTxt, {
            font: '12px Arial',
            fill: '#e2e8f0',
            align: 'center',
            lineSpacing: 4
        });
        stats.anchor.setTo(0.5);

        // Botón JUGAR DE NUEVO
        var btn = juego.add.graphics(0, 0);
        btn.beginFill(0x10b981);
        btn.lineStyle(2, 0x34d399, 1);
        btn.drawRoundedRect(35, 430, 220, 48, 10);
        btn.endFill();

        var btnTxt = juego.add.text(juego.width / 2, 454, '🔄 JUGAR DE NUEVO', {
            font: 'bold 15px "Arial Black", Arial',
            fill: '#ffffff',
            stroke: '#064e3b',
            strokeThickness: 3
        });
        btnTxt.anchor.setTo(0.5);

        var hitArea = new Phaser.Rectangle(35, 430, 220, 48);
        juego.input.onDown.add(function(pointer) {
            if (hitArea.contains(pointer.x, pointer.y)) {
                Ganaste.reiniciar();
            }
        });

        this.enterKey = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.espacioKey = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        var press = juego.add.text(juego.width / 2, 498, 'Presiona ENTER para Volver a Jugar', {
            font: '11px Arial',
            fill: '#94a3b8'
        });
        press.anchor.setTo(0.5);
    },

    update: function() {
        this.fondo.tilePosition.y += 0.8;
        if (this.enterKey.isDown || this.espacioKey.isDown) {
            this.reiniciar();
        }
    },

    reiniciar: function() {
        Sonidos.playGasolina();
        Sonidos.playBGM();
        juego.state.start('Juego', true, false, { vidas: 3, puntos: 0, nivel: 1 });
    }
};
