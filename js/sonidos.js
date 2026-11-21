// Sistema de audio dual: Web Audio API sintetizado nativo + Audio Elements WAV
// Garantiza funcionamiento sin problemas de CORS tanto en local (file://) como en la web (Netlify, Vercel, GitHub Pages)

var Sonidos = (function() {
    var audioCtx = null;
    var muted = false;
    var bgmOsc = null;
    var bgmGain = null;
    var bgmInterval = null;
    var isBgmPlaying = false;
    
    // Archivos de audio pre-cargados
    var audioFiles = {
        colision: new Audio('audio/colision.wav'),
        gasolina: new Audio('audio/gasolina.wav'),
        victoria: new Audio('audio/victoria.wav'),
        derrota: new Audio('audio/derrota.wav'),
        bgm: new Audio('audio/bgm.wav')
    };
    audioFiles.bgm.loop = true;

    function getAudioContext() {
        if (!audioCtx) {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    return {
        init: function() {
            // Desbloquear audio con primera interacción de usuario
            var unlock = function() {
                getAudioContext();
                window.removeEventListener('click', unlock);
                window.removeEventListener('keydown', unlock);
                window.removeEventListener('touchstart', unlock);
            };
            window.addEventListener('click', unlock);
            window.addEventListener('keydown', unlock);
            window.addEventListener('touchstart', unlock);
        },

        isMuted: function() {
            return muted;
        },

        toggleMute: function() {
            muted = !muted;
            if (muted) {
                this.stopBGM();
            } else {
                this.playBGM();
            }
            return muted;
        },

        playBGM: function() {
            if (muted || isBgmPlaying) return;
            isBgmPlaying = true;
            
            // Intentar reproducir archivo WAV de fondo
            audioFiles.bgm.volume = 0.4;
            var playPromise = audioFiles.bgm.play();
            if (playPromise !== undefined) {
                playPromise.catch(function() {
                    // Fallback sintetizado si el navegador bloquea la reproducción de archivo
                    Sonidos.startSynthBGM();
                });
            }
        },

        stopBGM: function() {
            isBgmPlaying = false;
            try {
                audioFiles.bgm.pause();
                audioFiles.bgm.currentTime = 0;
            } catch(e) {}
            
            if (bgmInterval) {
                clearInterval(bgmInterval);
                bgmInterval = null;
            }
            if (bgmOsc) {
                try { bgmOsc.stop(); } catch(e) {}
                bgmOsc = null;
            }
        },

        startSynthBGM: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            
            var bassNotes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
            var step = 0;
            if (bgmInterval) clearInterval(bgmInterval);
            
            bgmInterval = setInterval(function() {
                if (muted || !isBgmPlaying) return;
                var freq = bassNotes[step % bassNotes.length];
                step++;
                
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.22);
            }, 250);
        },

        playColision: function() {
            if (muted) return;
            try {
                audioFiles.colision.currentTime = 0;
                audioFiles.colision.volume = 0.8;
                audioFiles.colision.play().catch(function() {
                    Sonidos.synthColision();
                });
            } catch(e) {
                Sonidos.synthColision();
            }
        },

        synthColision: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            
            // Ruido blanco explosivo con decaimiento
            var bufferSize = ctx.sampleRate * 0.4;
            var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            var data = buffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-6 * (i / bufferSize));
            }
            var noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            var filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
            
            var gain = ctx.createGain();
            gain.gain.setValueAtTime(0.7, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        },

        playGasolina: function() {
            if (muted) return;
            try {
                audioFiles.gasolina.currentTime = 0;
                audioFiles.gasolina.volume = 0.8;
                audioFiles.gasolina.play().catch(function() {
                    Sonidos.synthGasolina();
                });
            } catch(e) {
                Sonidos.synthGasolina();
            }
        },

        synthGasolina: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            
            var notes = [587.33, 880]; // D5 -> A5 pickup
            notes.forEach(function(freq, index) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
                
                gain.gain.setValueAtTime(0.18, ctx.currentTime + index * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.15);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + index * 0.08);
                osc.stop(ctx.currentTime + index * 0.08 + 0.15);
            });
        },

        playVictoria: function() {
            if (muted) return;
            try {
                audioFiles.victoria.currentTime = 0;
                audioFiles.victoria.volume = 0.85;
                audioFiles.victoria.play().catch(function() {
                    Sonidos.synthVictoria();
                });
            } catch(e) {
                Sonidos.synthVictoria();
            }
        },

        synthVictoria: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            var melody = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            melody.forEach(function(freq, i) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
                gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.18);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.18 + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.18);
                osc.stop(ctx.currentTime + i * 0.18 + 0.35);
            });
        },

        playDerrota: function() {
            if (muted) return;
            try {
                audioFiles.derrota.currentTime = 0;
                audioFiles.derrota.volume = 0.85;
                audioFiles.derrota.play().catch(function() {
                    Sonidos.synthDerrota();
                });
            } catch(e) {
                Sonidos.synthDerrota();
            }
        },

        synthDerrota: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            var melody = [440.0, 392.0, 349.23, 293.66]; // A4, G4, F4, D4
            melody.forEach(function(freq, i) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.22);
                gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.22);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.22 + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.22);
                osc.stop(ctx.currentTime + i * 0.22 + 0.3);
            });
        }
    };
})();

// Inicializar detector de interacción
Sonidos.init();
