document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const heroSection = document.querySelector('.hero-section');
    const animationLayer = document.querySelector('.hero-bg-animation-layer');
    const thumbnails = document.querySelectorAll('.thumb');
    const headlineSpan = document.querySelector('.hero-headline span');
    const subtextSpan = document.querySelector('.hero-subtext span');
    const bgLayers = [document.getElementById('hero-bg-1'), document.getElementById('hero-bg-2')];

    if (!heroSection || bgLayers.includes(null) || thumbnails.length === 0 || !headlineSpan || !subtextSpan) {
        return;
    }

    const imageUrls = Array.from(thumbnails).map(thumb => {
        // Extract URL from the inline style
        const style = thumb.style.backgroundImage;
        return style.substring(style.indexOf('(') + 2, style.indexOf(')') - 1);
    });

    const headlines = Array.from(thumbnails).map(thumb => thumb.dataset.headline);
    const subtexts = Array.from(thumbnails).map(thumb => thumb.dataset.subtext);

    let currentIndex = 0;
    let currentBgLayer = 0;

    // Set initial state
    bgLayers[currentBgLayer].style.backgroundImage = `url('${imageUrls[currentIndex]}')`;
    bgLayers[currentBgLayer].classList.add('is-active');

    thumbnails[currentIndex].classList.add('active');
    headlineSpan.textContent = headlines[currentIndex];
    subtextSpan.textContent = subtexts[currentIndex];

    const changeContent = () => {
        const nextIndex = (currentIndex + 1) % imageUrls.length;
        const nextBgLayer = 1 - currentBgLayer; // Toggles between 0 and 1

        // --- Animate Background Image ---
        // Set up the next image on the hidden layer
        bgLayers[nextBgLayer].style.backgroundImage = `url('${imageUrls[nextIndex]}')`;
        // Add active class to fade it in and start zoom
        bgLayers[nextBgLayer].classList.add('is-active');
        // Remove active class from the old layer to fade it out
        bgLayers[currentBgLayer].classList.remove('is-active');

        // --- Animate Text (runs concurrently) ---
        headlineSpan.classList.add('is-hiding');
        subtextSpan.classList.add('is-hiding');

        headlineSpan.addEventListener('animationend', (e) => {
            if (e.animationName === 'hideToBottom') {
                headlineSpan.textContent = headlines[nextIndex];
                subtextSpan.textContent = subtexts[nextIndex];

                headlineSpan.classList.remove('is-hiding');
                subtextSpan.classList.remove('is-hiding');
                headlineSpan.classList.add('is-animating');
                subtextSpan.classList.add('is-animating');

                headlineSpan.addEventListener('animationend', () => { headlineSpan.classList.remove('is-animating'); }, { once: true });
                subtextSpan.addEventListener('animationend', () => { subtextSpan.classList.remove('is-animating'); }, { once: true });
            }
        }, { once: true });

        // Update active thumbnail
        thumbnails[currentIndex].classList.remove('active');
        thumbnails[nextIndex].classList.add('active');
        
        // Update indices for the next cycle
        currentIndex = nextIndex;
        currentBgLayer = nextBgLayer;
    };

    setInterval(changeContent, 5000); // Increased interval for the slower zoom effect

    // Product image hover effect
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const productImage = card.querySelector('.product-image');
        if (productImage) {
            const beforeImage = productImage.dataset.beforeImage;
            const afterImage = productImage.dataset.afterImage;

            if (beforeImage && afterImage) {
                card.addEventListener('mouseenter', () => {
                    productImage.style.backgroundImage = `url('${afterImage}')`;
                });

                card.addEventListener('mouseleave', () => {
                    productImage.style.backgroundImage = `url('${beforeImage}')`;
                });
            }
        }
    });

    // Info popup hover effect
    const infoPoints = document.querySelectorAll('.info-point');

    infoPoints.forEach(point => {
        const popup = document.getElementById(point.dataset.target);
        if (popup) {
            point.addEventListener('mouseenter', () => {
                // Position popup relative to the point
                const pointRect = point.getBoundingClientRect();
                const containerRect = point.offsetParent.getBoundingClientRect();
                
                popup.style.left = `${pointRect.left - containerRect.left + (pointRect.width / 2)}px`;
                popup.style.top = `${pointRect.top - containerRect.top}px`;

                point.classList.add('active');
            });

            point.addEventListener('mouseleave', () => {
                point.classList.remove('active');
            });
        }
    });

    // Footer banner scroll animations
    const footerBanner = document.querySelector('.footer-banner');
    const footerBannerText = document.querySelector('.footer-banner-text h2 span');

    console.log('Footer banner element:', footerBanner);
    console.log('Footer banner text element:', footerBannerText);

    if (footerBanner && footerBannerText) {
        console.log('Footer elements found, setting up scroll animation');
        
        lenis.on('scroll', (e) => {
            const scrollProgress = e.progress; // 0 to 1
            console.log('Scroll progress:', scrollProgress);
            
            // Zoom out animation at 60% scroll
            if (scrollProgress >= 0.6) {
                const zoomProgress = Math.min((scrollProgress - 0.6) / 0.2, 1); // 0.6 to 0.8
                const scale = 1 + (0.15 * (1 - zoomProgress)); // Start at 1.15, end at 1
                footerBanner.style.transform = `scale(${scale})`;
                console.log('Zoom animation - scale:', scale);
            } else {
                footerBanner.style.transform = 'scale(1.15)';
            }
            
            // Text height animation at 80% scroll
            if (scrollProgress >= 0.8) {
                const textProgress = Math.min((scrollProgress - 0.8) / 0.2, 1); // 0.8 to 1.0
                footerBannerText.style.height = `${textProgress * 100}%`;
                footerBannerText.style.overflow = 'hidden';
                console.log('Text animation - height:', textProgress * 100 + '%');
            } else {
                footerBannerText.style.height = '0%';
                footerBannerText.style.overflow = 'hidden';
            }
        });
    } else {
        console.error('Footer elements not found!');
    }

    // Mega menu positioning
    const dropdownContainer = document.querySelector('.has-dropdown');
    const megaMenu = document.querySelector('.mega-menu');

    if (dropdownContainer && megaMenu) {
        dropdownContainer.addEventListener('mouseenter', () => {
            const rect = dropdownContainer.getBoundingClientRect();
            megaMenu.style.left = `-${rect.left}px`;
        });
    }

    // Promo text animation
    const promoTextSpan = document.getElementById('promo-text');
    if (promoTextSpan) {
        const messages = [
            "FREE RETURNS WITHIN 30 DAYS",
            "20% OFF WITH PURCHASES OF $200 OR MORE",
            "FREE STANDARD SHIPPING ON ALL ORDERS"
        ];
        let messageIndex = 0;

        setInterval(() => {
            promoTextSpan.style.opacity = '0';
            setTimeout(() => {
                messageIndex = (messageIndex + 1) % messages.length;
                promoTextSpan.textContent = messages[messageIndex];
                promoTextSpan.style.opacity = '1';
            }, 300); // Fade transition duration
        }, 3000); // Time each message is displayed
    }
});



