(function() {
    function isMobile() {
        return (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.innerWidth <= 768
        );
    }

    function showMobileBlock() {
        // Prevent multiple overlays and crashes if body isn't ready
        if (!document.body || document.getElementById('mobileBlockOverlay')) return;

        // Hide everything
        document.body.style.overflow = 'hidden';

        // Create overlay
        var overlay = document.createElement('div');
        overlay.id = 'mobileBlockOverlay';
        overlay.innerHTML = `
            <div class="mobile-block-content">
                <div class="mobile-block-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff69b4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="#e74c3c" stroke-width="2.5"/>
                    </svg>
                </div>
                <h1 class="mobile-block-title">Oops!</h1>
                <p class="mobile-block-msg">Sorry, We are not yet on Mobile Browsers</p>
                <p class="mobile-block-sub">Please visit us on a desktop or laptop for the best experience.</p>
            </div>
        `;

        // Inject styles
        var style = document.createElement('style');
        style.textContent = `
            #mobileBlockOverlay {
                position: fixed;
                inset: 0;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                background-image: url("assets/bg_pattern.png");
                background-repeat: repeat;
                background-size: 350px;
                background-color: #fff0f6;
            }
            .mobile-block-content {
                text-align: center;
                padding: 40px 30px;
                max-width: 360px;
                background: rgba(255, 255, 255, 0.85);
                backdrop-filter: blur(12px);
                border-radius: 32px;
                border: 2px solid rgba(255, 182, 217, 0.6);
                box-shadow: 0 20px 60px rgba(255, 105, 180, 0.2), 0 0 30px rgba(255, 182, 217, 0.3);
                animation: mobileBlockFadeIn 0.6s ease;
            }
            .mobile-block-icon {
                margin-bottom: 20px;
            }
            .mobile-block-title {
                font-family: 'Pacifico', 'Quicksand', cursive, sans-serif;
                font-size: 36px;
                color: #d6336c;
                margin: 0 0 12px 0;
            }
            .mobile-block-msg {
                font-family: 'Quicksand', 'Fredoka', sans-serif;
                font-size: 18px;
                font-weight: 600;
                color: #5a0035;
                margin: 0 0 10px 0;
                line-height: 1.5;
            }
            .mobile-block-sub {
                font-family: 'Quicksand', 'Fredoka', sans-serif;
                font-size: 14px;
                color: #8b5e7a;
                margin: 0;
                opacity: 0.8;
            }
            @keyframes mobileBlockFadeIn {
                from { opacity: 0; transform: scale(0.92) translateY(20px); }
                to   { opacity: 1; transform: scale(1) translateY(0); }
            }
            /* Hide everything else when overlay is active */
            #mobileBlockOverlay ~ * {
                display: none !important;
            }
        `;

        document.head.appendChild(style);
        // Insert as the very first child of body so the sibling selector hides everything after it
        document.body.insertBefore(overlay, document.body.firstChild);
    }

    if (isMobile()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showMobileBlock);
        } else {
            showMobileBlock();
        }
    }

    // Also handle resize (e.g. DevTools mobile toggle)
    window.addEventListener('resize', function() {
        var existing = document.getElementById('mobileBlockOverlay');
        if (isMobile() && !existing) {
            showMobileBlock();
        } else if (!isMobile() && existing) {
            existing.remove();
            document.body.style.overflow = '';
        }
    });
})();
