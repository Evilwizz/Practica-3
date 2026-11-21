// ==========================================
// ESTADO: TERMINADO (VUELVE A INTENTARLO)
// ==========================================
var Terminado = {
    init: function(datos) {
        this.puntosFinales = (datos && typeof datos.puntos !== 'undefined') ? datos.puntos : 0;
        this.nivelAlcanzado = (datos && typeof datos.nivel !== 'undefined') ? datos.nivel : 1;
    },

    preload: function() {
        juego.load.image('bg', 'img/bg.png');
        juego.load.spritesheet('explosion', 'img/explosion.png', 54, 56, 8);
        juego.forceSingleUpdate = true;
    },

    create: function() {
        this.fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');

        var overlay = juego.add.graphics(0, 0);
        overlay.beginFill(0x450a0a, 0.92);
        overlay.drawRect(0, 0, 290, 540);
        overlay.endFill();

        var exp = juego.add.sprite(juego.width / 2, 70, 'explosion');
        exp.anchor.setTo(0.5);
        exp.scale.setTo(1.3);
        exp.animations.add('boom');
        exp.animations.play('boom', 6, true);

        var titulo = juego.add.text(juego.width / 2, 135, 'VUELVE A\nINTENTARLO', {
            font: 'bold 24px "Arial Black", Arial',
            fill: '#ef4444',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 5
        });
        titulo.anchor.setTo(0.5);

        var sub = juego.add.text(juego.width / 2, 185, '💥 ¡Has chocado contra el obstáculo! 💥', {
            font: 'bold 11px Arial',
            fill: '#fca5a5'
        });
        sub.anchor.setTo(0.5);

        var card = juego.add.graphics(15, 205);
        card.beginFill(0x18181b, 0.95);
        card.lineStyle(2, 0xdc2626, 1);
        card.drawRoundedRect(0, 0, 260, 200, 10);
        card.endFill();

        var nombreActual = window.getNombreJugador ? window.getNombreJugador() : 'Aldair Jose Lozano Santiago';
        var txtNombre = juego.add.text(juego.width / 2, 230, 'PILOTO / ESTUDIANTE:\n' + nombreActual, {
            font: 'bold 13px Arial',
            fill: '#38bdf8',
            align: 'center',
            stroke: '#000',
            strokeThickness: 2
        });
        txtNombre.anchor.setTo(0.5);

        var statsTxt = 
            '------------------------------------\n' +
            '⚠️ Vidas Restantes: 0 (Agotadas)\n' +
            '📍 Llegaste hasta: Nivel ' + this.nivelAlcanzado + '\n' +
            '🛢️ Barriles Obtenidos: ' + this.puntosFinales + '\n' +
            '💡 Consejo: Atento a los cambios de carril\n' +
            '------------------------------------';

        var stats = juego.add.text(juego.width / 2, 335, statsTxt, {
            font: '12px Arial',
            fill: '#e2e8f0',
            align: 'center',
            lineSpacing: 4
        });
        stats.anchor.setTo(0.5);

        var btn = juego.add.graphics(0, 0);
        btn.beginFill(0xdc2626);
        btn.lineStyle(2, 0xf87171, 1);
        btn.drawRoundedRect(35, 430, 220, 48, 10);
        btn.endFill();

        var btnTxt = juego.add.text(juego.width / 2, 454, '🔥 REINTENTAR 🔥', {
            font: 'bold 16px "Arial Black", Arial',
            fill: '#ffffff',
            stroke: '#7f1d1d',
            strokeThickness: 3
        });
        btnTxt.anchor.setTo(0.5);

        var hitArea = new Phaser.Rectangle(35, 430, 220, 48);
        juego.input.onDown.add(function(pointer) {
            if (hitArea.contains(pointer.x, pointer.y)) {
                Terminado.reintentar();
            }
        });

        this.enterKey = juego.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.espacioKey = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        var press = juego.add.text(juego.width / 2, 498, 'Presiona ENTER para Reintentar', {
            font: '11px Arial',
            fill: '#94a3b8'
        });
        press.anchor.setTo(0.5);
    },

    update: function() {
        if (this.enterKey.isDown || this.espacioKey.isDown) {
            this.reintentar();
        }
    },

    reintentar: function() {
        Sonidos.playGasolina();
        Sonidos.playBGM();
        juego.state.start('Juego', true, false, { vidas: 3, puntos: 0, nivel: 1 });
    }
};
