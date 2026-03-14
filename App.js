(function(){
    const curtain = document.getElementById('curtain');
    const site    = document.getElementById('site');
    const header  = document.getElementById('main-header');
    let revealed  = false;

    function reveal() {
        if (revealed) return;
        revealed = true;

        /* Trigger the curtain rise */
        curtain.classList.add('rising');

        /* Wait for rise to finish (1s duration), then show site and hard-pin header */
        setTimeout(() => {
            site.classList.add('revealed');
            curtain.style.visibility = 'hidden';
            curtain.style.pointerEvents = 'none';

            /* FIX: once animation fills are done, lock the header in place
               so it can never flash back to translateY(-100%) */
            setTimeout(() => {
                header.style.transform = 'translateY(0)';
                header.style.animation = 'none';
            }, 800);
        }, 1000);
    }

    /* FIX: wait for the curtain's own intro animations to finish (~1.05s)
       before triggering the rise, via a plain timeout — not animationend,
       which bubbles up from child elements and fires too early */
    setTimeout(reveal, 1100);

    /* Hard fallback */
    setTimeout(reveal, 4000);

    /* Mobile menu — toggle open + update aria-expanded for a11y */
    const mobileBtn  = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    document.querySelectorAll('#mobile-menu a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.setAttribute('aria-label', 'Open menu');
        });
    });

    /* Scroll reveal */
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                // Animate counters inside this element
                e.target.querySelectorAll('.counter').forEach(el => {
                    const target = parseInt(el.dataset.target, 10);
                    const isDecimal = el.dataset.decimal === 'true';
                    const duration = 1200;
                    const start = performance.now();
                    const tick = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const val = Math.round(eased * target);
                        el.textContent = isDecimal
                            ? (val / 100).toFixed(2)
                            : val;
                        if (progress < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                });
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();