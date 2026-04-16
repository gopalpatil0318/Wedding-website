/* ═══════════════════════════════════════════════════
   DEEPALI & SHIV — Ivory-Elegance Dark Luxury
   JS — Curtain reveal, Scratch card, Slideshow,
         Countdown, Scroll animations, Audio, Particles
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── DOM ──
    var cover = document.getElementById('cover');
    var sealBtn = document.getElementById('seal-btn');
    var mainContent = document.getElementById('main-content');
    var audioToggle = document.getElementById('audio-toggle');
    var bgMusic = document.getElementById('bg-music');
    var iconOff = audioToggle.querySelector('.audio-icon-off');
    var iconOn = audioToggle.querySelector('.audio-icon-on');
    var scrollHint = document.getElementById('scroll-hint');

    var isPlaying = false;
    var coverOpened = false;

    // Lock scroll until cover opens
    document.body.style.overflow = 'hidden';

    // ═══════════════════════════════════
    // GLOBAL FLOATING PARTICLES
    // ═══════════════════════════════════
    (function createParticles() {
        var container = document.getElementById('global-particles');
        if (!container) return;
        for (var i = 0; i < 25; i++) {
            var p = document.createElement('div');
            p.className = 'g-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDelay = (Math.random() * 12) + 's';
            p.style.animationDuration = (8 + Math.random() * 8) + 's';
            var size = 2 + Math.random() * 3;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            container.appendChild(p);
        }
    })();

    // ═══════════════════════════════════
    // CURTAIN REVEAL
    // ═══════════════════════════════════
    function openInvitation() {
        if (coverOpened) return;
        coverOpened = true;

        // Trigger curtain split
        cover.classList.add('open');

        // Show main content
        mainContent.classList.add('visible');

        // Show audio toggle
        setTimeout(function () {
            audioToggle.classList.add('visible');
        }, 800);

        // Staggered hero animations
        var heroAnims = document.querySelectorAll('.hero-anim');
        heroAnims.forEach(function (el) {
            var delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
            setTimeout(function () {
                el.classList.add('animate');
            }, 600 + delay * 150);
        });

        // Remove cover from DOM after animation
        setTimeout(function () {
            cover.classList.add('gone');
        }, 2000);

        // Restore scroll
        document.body.style.overflow = '';

        // Try play music
        tryPlayMusic();
    }

    sealBtn.addEventListener('click', openInvitation);
    sealBtn.addEventListener('touchend', function (e) {
        e.preventDefault();
        openInvitation();
    });

    // ═══════════════════════════════════
    // AUDIO TOGGLE
    // ═══════════════════════════════════
    function tryPlayMusic() {
        if (!bgMusic) return;
        var p = bgMusic.play();
        if (p !== undefined) {
            p.then(function () {
                isPlaying = true;
                iconOff.classList.add('hidden');
                iconOn.classList.remove('hidden');
            }).catch(function () {
                isPlaying = false;
            });
        }
    }

    audioToggle.addEventListener('click', function () {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            iconOff.classList.remove('hidden');
            iconOn.classList.add('hidden');
        } else {
            bgMusic.play().then(function () {
                isPlaying = true;
                iconOff.classList.add('hidden');
                iconOn.classList.remove('hidden');
            }).catch(function () {});
        }
    });

    // ═══════════════════════════════════
    // COUNTDOWN TIMER
    // ═══════════════════════════════════
    var WEDDING_DATE = new Date('2026-05-02T11:00:00+05:30');
    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
        var diff = WEDDING_DATE - new Date();
        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }
        var d = Math.floor(diff / 86400000); diff -= d * 86400000;
        var h = Math.floor(diff / 3600000); diff -= h * 3600000;
        var m = Math.floor(diff / 60000); diff -= m * 60000;
        var s = Math.floor(diff / 1000);
        daysEl.textContent = pad(d);
        hoursEl.textContent = pad(h);
        minutesEl.textContent = pad(m);
        secondsEl.textContent = pad(s);
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ═══════════════════════════════════
    // SCROLL FADE-IN
    // ═══════════════════════════════════
    var fadeEls = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        fadeEls.forEach(function (el) { obs.observe(el); });
    } else {
        fadeEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // ═══════════════════════════════════
    // SCROLL HINT HIDE
    // ═══════════════════════════════════
    if (scrollHint) {
        var hintHidden = false;
        window.addEventListener('scroll', function () {
            if (!hintHidden && window.scrollY > 100) {
                scrollHint.classList.add('hide');
                hintHidden = true;
            }
        }, { passive: true });
    }

    // ═══════════════════════════════════
    // SCRATCH CARD
    // ═══════════════════════════════════
    (function initScratch() {
        var canvas = document.getElementById('scratch-canvas');
        var card = document.getElementById('scratch-card');
        if (!canvas || !card) return;

        var ctx = canvas.getContext('2d');
        var isDrawing = false;
        var revealed = false;

        function sizeCanvas() {
            var rect = card.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            // Draw dark overlay
            ctx.fillStyle = '#1e1c18';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw gold text hint
            ctx.fillStyle = '#c9a96e';
            ctx.font = '14px Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Scratch here ✨', canvas.width / 2, canvas.height / 2 + 5);
        }

        // Use ResizeObserver or just size once visible
        var trySize = setInterval(function () {
            if (card.offsetWidth > 0) {
                sizeCanvas();
                clearInterval(trySize);
            }
        }, 200);

        function getPos(e) {
            var rect = canvas.getBoundingClientRect();
            var touch = e.touches ? e.touches[0] : e;
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        }

        function scratch(pos) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
            ctx.fill();
        }

        function checkReveal() {
            if (revealed) return;
            var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            var total = pixels.length / 4;
            var clear = 0;
            for (var i = 3; i < pixels.length; i += 16) {
                if (pixels[i] === 0) clear++;
            }
            var sampled = total / 4;
            if (clear / sampled > 0.45) {
                revealed = true;
                canvas.style.transition = 'opacity 0.5s';
                canvas.style.opacity = '0';
                setTimeout(function () { canvas.style.display = 'none'; }, 500);
                burstConfetti();
            }
        }

        function burstConfetti() {
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            for (var i = 0; i < 80; i++) {
                var el = document.createElement('div');
                el.className = 'confetti-piece';
                // Spread across full viewport width, start above viewport
                el.style.left = Math.random() * vw + 'px';
                el.style.top = -(10 + Math.random() * 60) + 'px';
                // Fall distance: full viewport + extra
                var fall = vh + 80 + Math.random() * 200;
                var rot = (Math.random() * 720 - 360) + 'deg';
                var sway = (Math.random() - 0.5) * 120;
                el.style.setProperty('--fall', fall + 'px');
                el.style.setProperty('--rot', rot);
                el.style.setProperty('--sway', sway + 'px');
                var duration = 3.5 + Math.random() * 3;
                el.style.animationDuration = duration + 's';
                el.style.animationDelay = (Math.random() * 2) + 's';
                document.body.appendChild(el);
                (function (e, d) {
                    setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, (d + 2.5) * 1000);
                })(el, duration);
            }
        }

        canvas.addEventListener('mousedown', function (e) { isDrawing = true; scratch(getPos(e)); });
        canvas.addEventListener('mousemove', function (e) { if (isDrawing) scratch(getPos(e)); });
        canvas.addEventListener('mouseup', function () { isDrawing = false; checkReveal(); });
        canvas.addEventListener('mouseleave', function () { isDrawing = false; });

        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            isDrawing = true;
            scratch(getPos(e));
        }, { passive: false });
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (isDrawing) scratch(getPos(e));
        }, { passive: false });
        canvas.addEventListener('touchend', function () {
            isDrawing = false;
            checkReveal();
        });
    })();

    // ═══════════════════════════════════
    // SLIDESHOW
    // ═══════════════════════════════════
    (function initSlideshow() {
        var track = document.getElementById('slideshow-track');
        var dotsWrap = document.getElementById('slideshow-dots');
        if (!track || !dotsWrap) return;

        var dots = dotsWrap.querySelectorAll('.dot');
        var current = 0;
        var total = dots.length;

        function goTo(index) {
            current = index;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                goTo(parseInt(this.getAttribute('data-index'), 10));
            });
        });

        // Auto-advance every 4s
        setInterval(function () {
            goTo((current + 1) % total);
        }, 4000);
    })();

    // ═══════════════════════════════════
    // SMOOTH SCROLL ANCHORS
    // ═══════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
