// Enhanced Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking close button or text button
    const closeModal = function() {
        const modal = document.querySelector(".modal-container");
        modal.style.animation = "fadeOut 0.5s ease-in-out forwards";
        setTimeout(() => {
            modal.style.display = "none";
            modal.style.animation = "";
        }, 500);
    };

    document.querySelector(".close-btn").addEventListener("click", closeModal);
    document.querySelector(".close-btn-text").addEventListener("click", closeModal);

    // Enhanced Timeline slider functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.timeline-item');
    const totalSlides = slides.length;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    // Add touch and mouse events for dragging
    slides.forEach(slide => {
        slide.addEventListener('mousedown', dragStart);
        slide.addEventListener('touchstart', dragStart);
        slide.addEventListener('mouseup', dragEnd);
        slide.addEventListener('touchend', dragEnd);
        slide.addEventListener('mousemove', drag);
        slide.addEventListener('touchmove', drag);
        slide.addEventListener('mouseleave', dragEnd);
    });

    function dragStart(e) {
        isDragging = true;
        startPos = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        slides.forEach(slide => {
            slide.style.transition = 'none';
        });
    }

    function drag(e) {
        if (!isDragging) return;
        const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        
        slides.forEach(slide => {
            slide.style.transform = `translateX(${currentTranslate}px)`;
        });
    }

    function dragEnd() {
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        
        if (Math.abs(movedBy) > 100) {
            if (movedBy > 0) {
                changeSlide(-1);
            } else {
                changeSlide(1);
            }
        }
        
        slides.forEach(slide => {
            slide.style.transition = 'transform 0.3s ease-out';
            slide.style.transform = `translateX(${prevTranslate}px)`;
        });
    }

    function changeSlide(direction) {
        slides[currentSlide].classList.remove('active-slide');
        currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active-slide');
        
        // Animate the transition
        const timelineItems = document.querySelector('.timeline-items');
        const slideWidth = slides[0].offsetWidth;
        const gap = 20; // gap between slides
        const newPosition = -currentSlide * (slideWidth + gap);
        
        timelineItems.style.transform = `translateX(${newPosition}px)`;
        prevTranslate = newPosition;
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });

    // Add smooth scroll to timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', () => {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    // Add parallax effect to timeline title
    const timelineTitle = document.querySelector('.timeline-title');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        timelineTitle.style.transform = `translateX(-50%) translateY(${scrolled * 0.1}px)`;
    });

    // Add hover effect to timeline dots
    document.querySelectorAll('.timeline-dot').forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            dot.style.transform = 'scale(1.2)';
        });
        dot.addEventListener('mouseleave', () => {
            dot.style.transform = 'scale(1)';
        });
    });

    // Add animation to modal text
    const modalTexts = document.querySelectorAll('.modal-text p');
    modalTexts.forEach((text, index) => {
        text.style.animationDelay = `${index * 0.2}s`;
        text.classList.add('fade-in');
    });

    // Enhanced drag-to-scroll functionality with visual feedback
    let isScrolling = false;
    let startY;
    let scrollTop;
    let lastScrollTime = 0;
    let scrollVelocity = 0;
    let scrollDirection = 0;
    let scrollIndicator;
    let scrollIndicatorInner;
    let momentumScrolling = false;
    let momentumInterval;
    
    // Create scroll indicator
    function createScrollIndicator() {
        scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        scrollIndicatorInner = document.createElement('div');
        scrollIndicatorInner.className = 'scroll-indicator-inner';
        scrollIndicator.appendChild(scrollIndicatorInner);
        document.body.appendChild(scrollIndicator);
        
        // Update scroll indicator position
        updateScrollIndicator();
    }
    
    // Update scroll indicator position
    function updateScrollIndicator() {
        if (!scrollIndicator) return;
        
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollIndicatorInner.style.height = `${scrollPercent}%`;
        
        // Change color based on scroll position
        const hue = (scrollPercent * 3.6) % 360; // 360 degrees of hue
        scrollIndicatorInner.style.background = `linear-gradient(to bottom, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 50%))`;
    }
    
    // Initialize scroll indicator
    createScrollIndicator();
    
    // Add scroll event listener to update indicator
    window.addEventListener('scroll', () => {
        updateScrollIndicator();
        
        // Calculate scroll velocity
        const now = Date.now();
        const timeDiff = now - lastScrollTime;
        if (timeDiff > 0) {
            const currentScroll = window.scrollY;
            scrollVelocity = (currentScroll - scrollTop) / timeDiff;
            scrollDirection = currentScroll > scrollTop ? 1 : -1;
        }
        lastScrollTime = now;
        scrollTop = window.scrollY;
    });
    
    // Mouse events for drag scrolling
    document.addEventListener('mousedown', (e) => {
        // Don't start drag scrolling if clicking on interactive elements
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
            e.target.closest('.modal-container') || e.target.closest('.timeline')) {
            return;
        }
        
        isScrolling = true;
        startY = e.pageY;
        scrollTop = window.scrollY;
        
        // Add visual feedback
        document.body.classList.add('dragging');
        
        // Show scroll indicator
        if (scrollIndicator) {
            scrollIndicator.classList.add('active');
        }
        
        // Add cursor style
        document.body.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        
        e.preventDefault();
        const y = e.pageY;
        const walk = (y - startY) * 1.5; // Adjust scroll speed
        
        // Apply scroll with easing
        window.scrollTo({
            top: scrollTop - walk,
            behavior: 'auto'
        });
        
        // Add visual feedback based on scroll direction
        if (walk > 0) {
            document.body.classList.add('scrolling-up');
            document.body.classList.remove('scrolling-down');
        } else {
            document.body.classList.add('scrolling-down');
            document.body.classList.remove('scrolling-up');
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (!isScrolling) return;
        
        isScrolling = false;
        document.body.classList.remove('dragging', 'scrolling-up', 'scrolling-down');
        document.body.style.cursor = '';
        
        // Hide scroll indicator after a delay
        if (scrollIndicator) {
            setTimeout(() => {
                scrollIndicator.classList.remove('active');
            }, 1000);
        }
        
        // Apply momentum scrolling if velocity is high enough
        if (Math.abs(scrollVelocity) > 0.5) {
            applyMomentumScrolling();
        }
    });
    
    document.addEventListener('mouseleave', () => {
        if (isScrolling) {
            isScrolling = false;
            document.body.classList.remove('dragging', 'scrolling-up', 'scrolling-down');
            document.body.style.cursor = '';
        }
    });
    
    // Touch events for mobile devices
    document.addEventListener('touchstart', (e) => {
        // Don't start drag scrolling if touching interactive elements
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
            e.target.closest('.modal-container') || e.target.closest('.timeline')) {
            return;
        }
        
        isScrolling = true;
        startY = e.touches[0].pageY;
        scrollTop = window.scrollY;
        
        // Add visual feedback
        document.body.classList.add('dragging');
        
        // Show scroll indicator
        if (scrollIndicator) {
            scrollIndicator.classList.add('active');
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        
        const y = e.touches[0].pageY;
        const walk = (y - startY) * 1.5;
        
        // Apply scroll with easing
        window.scrollTo({
            top: scrollTop - walk,
            behavior: 'auto'
        });
        
        // Add visual feedback based on scroll direction
        if (walk > 0) {
            document.body.classList.add('scrolling-up');
            document.body.classList.remove('scrolling-down');
        } else {
            document.body.classList.add('scrolling-down');
            document.body.classList.remove('scrolling-up');
        }
    });
    
    document.addEventListener('touchend', () => {
        if (!isScrolling) return;
        
        isScrolling = false;
        document.body.classList.remove('dragging', 'scrolling-up', 'scrolling-down');
        
        // Hide scroll indicator after a delay
        if (scrollIndicator) {
            setTimeout(() => {
                scrollIndicator.classList.remove('active');
            }, 1000);
        }
        
        // Apply momentum scrolling if velocity is high enough
        if (Math.abs(scrollVelocity) > 0.5) {
            applyMomentumScrolling();
        }
    });
    
    // Momentum scrolling effect
    function applyMomentumScrolling() {
        if (momentumScrolling) return;
        
        momentumScrolling = true;
        let velocity = scrollVelocity * 20; // Amplify the velocity
        let position = window.scrollY;
        const friction = 0.95; // Friction factor
        
        function momentumScroll() {
            if (Math.abs(velocity) < 0.1) {
                momentumScrolling = false;
                return;
            }
            
            position -= velocity;
            velocity *= friction;
            
            // Ensure we don't scroll beyond document bounds
            if (position < 0) {
                position = 0;
                velocity = 0;
            } else if (position > document.documentElement.scrollHeight - window.innerHeight) {
                position = document.documentElement.scrollHeight - window.innerHeight;
                velocity = 0;
            }
            
            window.scrollTo({
                top: position,
                behavior: 'auto'
            });
            
            requestAnimationFrame(momentumScroll);
        }
        
        momentumScroll();
    }
    
    // Add scroll snap for smoother scrolling experience
    document.querySelectorAll('section, .container-fluid').forEach(section => {
        section.style.scrollSnapAlign = 'start';
    });
    
    document.documentElement.style.scrollSnapType = 'y proximity';
    
    // Enhanced horizontal timeline scrolling
    const timeline = document.querySelector('.timeline');
    const timelineItems = document.querySelector('.timeline-items');
    const timelineProgress = document.querySelector('.timeline-progress');
    let isHorizontalDragging = false;
    let startX = 0;
    let currentX = 0;
    let prevX = 0;
    let timelineWidth = 0;
    let timelineContainerWidth = 0;
    let timelineIndicator;
    let timelineIndicatorInner;
    
    // Create timeline indicator
    function createTimelineIndicator() {
        timelineIndicator = document.createElement('div');
        timelineIndicator.className = 'timeline-indicator';
        timelineIndicatorInner = document.createElement('div');
        timelineIndicatorInner.className = 'timeline-indicator-inner';
        timelineIndicator.appendChild(timelineIndicatorInner);
        timeline.appendChild(timelineIndicator);
        
        // Update timeline indicator position
        updateTimelineIndicator();
    }
    
    // Update timeline indicator position
    function updateTimelineIndicator() {
        if (!timelineIndicator) return;
        
        // Calculate the percentage of scroll
        const scrollPercent = (Math.abs(currentX) / (timelineWidth - timelineContainerWidth)) * 100;
        timelineIndicatorInner.style.width = `${scrollPercent}%`;
        
        // Change color based on scroll position
        const hue = (scrollPercent * 3.6) % 360; // 360 degrees of hue
        timelineIndicatorInner.style.background = `linear-gradient(to right, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 50%))`;
    }
    
    // Initialize timeline dimensions
    function initTimelineDimensions() {
        timelineWidth = timelineItems.scrollWidth;
        timelineContainerWidth = timeline.offsetWidth;
        
        // Create timeline indicator if it doesn't exist
        if (!timelineIndicator) {
            createTimelineIndicator();
        }
        
        // Update timeline indicator
        updateTimelineIndicator();
    }
    
    // Initialize timeline dimensions on load and resize
    initTimelineDimensions();
    window.addEventListener('resize', initTimelineDimensions);
    
    // Add horizontal drag events to timeline
    timeline.addEventListener('mousedown', horizontalDragStart);
    timeline.addEventListener('touchstart', horizontalDragStart);
    timeline.addEventListener('mouseup', horizontalDragEnd);
    timeline.addEventListener('touchend', horizontalDragEnd);
    timeline.addEventListener('mousemove', horizontalDrag);
    timeline.addEventListener('touchmove', horizontalDrag);
    timeline.addEventListener('mouseleave', horizontalDragEnd);
    
    function horizontalDragStart(e) {
        isHorizontalDragging = true;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        currentX = prevX;
        
        // Add visual feedback
        timeline.classList.add('dragging');
        
        // Show timeline indicator
        if (timelineIndicator) {
            timelineIndicator.classList.add('active');
        }
        
        // Add cursor style
        timeline.style.cursor = 'grabbing';
    }
    
    function horizontalDrag(e) {
        if (!isHorizontalDragging) return;
        
        e.preventDefault();
        const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const walk = (x - startX);
        
        // Calculate new position with bounds
        let newX = prevX + walk;
        
        // Apply bounds to prevent scrolling beyond content
        const maxScroll = timelineWidth - timelineContainerWidth;
        if (newX > 0) newX = 0;
        if (newX < -maxScroll) newX = -maxScroll;
        
        // Apply the transform
        timelineItems.style.transform = `translateX(${newX}px)`;
        currentX = newX;
        
        // Update timeline indicator
        updateTimelineIndicator();
        
        // Add visual feedback based on scroll direction
        if (walk > 0) {
            timeline.classList.add('scrolling-left');
            timeline.classList.remove('scrolling-right');
        } else {
            timeline.classList.add('scrolling-right');
            timeline.classList.remove('scrolling-left');
        }
    }
    
    function horizontalDragEnd() {
        if (!isHorizontalDragging) return;
        
        isHorizontalDragging = false;
        prevX = currentX;
        
        // Remove visual feedback
        timeline.classList.remove('dragging', 'scrolling-left', 'scrolling-right');
        timeline.style.cursor = 'grab';
        
        // Hide timeline indicator after a delay
        if (timelineIndicator) {
            setTimeout(() => {
                timelineIndicator.classList.remove('active');
            }, 1000);
        }
        
        // Snap to nearest slide if close enough
        const slideWidth = slides[0].offsetWidth + 20; // Include gap
        const slideIndex = Math.round(Math.abs(currentX) / slideWidth);
        
        if (slideIndex !== currentSlide) {
            changeSlide(slideIndex - currentSlide);
        }
    }
    
    // Add horizontal scroll buttons
    function addTimelineScrollButtons() {
        const prevButton = document.createElement('button');
        prevButton.className = 'timeline-scroll-btn timeline-prev-btn';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.addEventListener('click', () => changeSlide(-1));
        
        const nextButton = document.createElement('button');
        nextButton.className = 'timeline-scroll-btn timeline-next-btn';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.addEventListener('click', () => changeSlide(1));
        
        timeline.appendChild(prevButton);
        timeline.appendChild(nextButton);
    }
    
    // Initialize timeline scroll buttons
    addTimelineScrollButtons();
    
    // Add memory navigation buttons
    function addMemoryNavigationButtons() {
        const memoryContainer = document.querySelector('.timeline-container');
        
        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'memory-navigation';
        
        // Create previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'memory-nav-btn memory-prev-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => changeSlide(-1));
        
        // Create next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'memory-nav-btn memory-next-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => changeSlide(1));
        
        // Create dots navigation
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'memory-dots';
        
        // Create dots for each slide
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'memory-dot';
            if (index === currentSlide) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                const direction = index > currentSlide ? 1 : -1;
                const steps = Math.abs(index - currentSlide);
                for (let i = 0; i < steps; i++) {
                    changeSlide(direction);
                }
            });
            
            dotsContainer.appendChild(dot);
        });
        
        // Add elements to navigation container
        navContainer.appendChild(prevBtn);
        navContainer.appendChild(dotsContainer);
        navContainer.appendChild(nextBtn);
        
        // Add navigation to memory container
        memoryContainer.appendChild(navContainer);
        
        // Update dots when slide changes
        const updateDots = () => {
            document.querySelectorAll('.memory-dot').forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
        
        // Override changeSlide to update dots
        const originalChangeSlide = changeSlide;
        changeSlide = function(direction) {
            originalChangeSlide(direction);
            updateDots();
        };
    }
    
    // Initialize memory navigation
    addMemoryNavigationButtons();
    
    // Add memory content animation
    function animateMemoryContent() {
        slides.forEach((slide, index) => {
            const content = slide.querySelector('.timeline-content');
            const dot = slide.querySelector('.timeline-dot');
            
            // Add staggered animation delay
            content.style.animationDelay = `${index * 0.1}s`;
            dot.style.animationDelay = `${index * 0.1}s`;
            
            // Add animation classes
            content.classList.add('memory-content-animate');
            dot.classList.add('memory-dot-animate');
        });
    }
    
    // Initialize memory content animation
    animateMemoryContent();
});

// Add CSS for new animations and scroll indicator
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in-out forwards;
        opacity: 0;
    }
    
    @keyframes fadeIn {
        from { 
            opacity: 0;
            transform: translateY(20px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .active-slide {
        transform: scale(1.05);
        box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }

    /* Hide scrollbar but keep functionality */
    ::-webkit-scrollbar {
        display: none;
    }
    
    html {
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
    }
    
    /* Scroll indicator styles */
    .scroll-indicator {
        position: fixed;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 100px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .scroll-indicator.active {
        opacity: 1;
    }
    
    .scroll-indicator-inner {
        width: 100%;
        height: 0%;
        background: linear-gradient(to bottom, #ff6b6b, #4ecdc4);
        border-radius: 10px;
        transition: height 0.1s ease;
    }
    
    /* Visual feedback for dragging */
    body.dragging {
        cursor: grabbing !important;
        user-select: none;
    }
    
    body.scrolling-up .timeline-title,
    body.scrolling-up .timeline-dot {
        transform: translateY(-5px);
        transition: transform 0.2s ease;
    }
    
    body.scrolling-down .timeline-title,
    body.scrolling-down .timeline-dot {
        transform: translateY(5px);
        transition: transform 0.2s ease;
    }
    
    /* Add subtle parallax effect to elements while scrolling */
    .timeline-item {
        transition: transform 0.3s ease-out;
    }
    
    body.scrolling-up .timeline-item:nth-child(odd) {
        transform: translateX(-10px);
    }
    
    body.scrolling-down .timeline-item:nth-child(even) {
        transform: translateX(10px);
    }
    
    /* Add glow effect to active elements */
    .timeline-dot.active {
        box-shadow: 0 0 15px rgba(255, 107, 107, 0.7);
    }
    
    /* Add subtle scale effect to content while scrolling */
    .timeline-content {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    body.dragging .timeline-content {
        transform: scale(0.98);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    /* Timeline horizontal scrolling styles */
    .timeline {
        position: relative;
        overflow: hidden;
        cursor: grab;
        user-select: none;
        padding: 20px 0;
    }
    
    .timeline:active {
        cursor: grabbing;
    }
    
    .timeline-items {
        display: flex;
        gap: 20px;
        will-change: transform;
        transition: transform 0.3s ease-out;
    }
    
    .timeline-item {
        flex: 0 0 300px;
        min-width: 300px;
    }
    
    .timeline-progress {
        position: absolute;
        height: 4px;
        background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
        top: 50px;
        left: 0;
        right: 0;
        width: 100%;
        border-radius: 2px;
        z-index: 1;
    }
    
    /* Timeline indicator styles */
    .timeline-indicator {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .timeline-indicator.active {
        opacity: 1;
    }
    
    .timeline-indicator-inner {
        width: 0%;
        height: 100%;
        background: linear-gradient(to right, #ff6b6b, #4ecdc4);
        border-radius: 10px;
        transition: width 0.1s ease;
    }
    
    /* Timeline scroll buttons */
    .timeline-scroll-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.8);
        border: none;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .timeline-scroll-btn:hover {
        background: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transform: translateY(-50%) scale(1.1);
    }
    
    .timeline-prev-btn {
        left: 10px;
    }
    
    .timeline-next-btn {
        right: 10px;
    }
    
    .timeline-scroll-btn i {
        color: #ff6b6b;
        font-size: 1.2em;
    }
    
    /* Visual feedback for horizontal dragging */
    .timeline.dragging {
        cursor: grabbing !important;
    }
    
    .timeline.scrolling-left .timeline-dot {
        transform: translateX(-5px);
        transition: transform 0.2s ease;
    }
    
    .timeline.scrolling-right .timeline-dot {
        transform: translateX(5px);
        transition: transform 0.2s ease;
    }
    
    /* Add pulse animation to timeline dots */
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
    }
    
    .timeline-dot {
        animation: pulse 2s infinite;
    }
    
    .timeline-dot:hover {
        animation: none;
        box-shadow: 0 0 0 4px #fff, 0 0 0 8px rgba(255, 107, 107, 0.5);
    }
    
    /* Memory navigation styles */
    .memory-navigation {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        gap: 20px;
    }
    
    .memory-nav-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(145deg, #ff6b6b, #4ecdc4);
        border: none;
        color: white;
        font-size: 1.2em;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    }
    
    .memory-nav-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    
    .memory-dots {
        display: flex;
        gap: 10px;
    }
    
    .memory-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: 2px solid #ff6b6b;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .memory-dot.active {
        background: #ff6b6b;
        transform: scale(1.2);
        box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
    }
    
    .memory-dot:hover {
        background: #ff6b6b;
        transform: scale(1.2);
    }
    
    /* Memory content animation */
    .memory-content-animate {
        animation: memoryContentFadeIn 0.8s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes memoryContentFadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .memory-dot-animate {
        animation: memoryDotPulse 2s infinite;
    }
    
    @keyframes memoryDotPulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(255, 107, 107, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
    }
    
    /* Memory slide transition */
    .timeline-item {
        transition: all 0.5s ease-out;
    }
    
    .timeline-item.active-slide {
        transform: scale(1.05);
        z-index: 10;
    }
    
    .timeline-item.active-slide .timeline-content {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
    
    .timeline-item.active-slide .timeline-dot {
        animation: none;
        box-shadow: 0 0 0 4px #fff, 0 0 0 8px rgba(255, 107, 107, 0.5);
    }
    
    /* Memory slide content highlight */
    .timeline-item.active-slide .timeline-date {
        color: #ff6b6b;
        font-size: 1.1em;
    }
    
    .timeline-item.active-slide .timeline-content h2 {
        color: #2c3e50;
        font-size: 1.8em;
    }
    
    .timeline-item.active-slide .timeline-content p {
        color: #333;
    }
`;
document.head.appendChild(style);