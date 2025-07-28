    // Game state
    let poppedCount = 0;
    let totalBubbles = 25;
    let soundEnabled = true;
    let audioContext;
    let bubbles = [];

    // Initialize audio context
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Create pop sound effect using Web Audio API
    function createPopSound(frequency = 800, duration = 0.1) {
        if (!soundEnabled || !audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filterNode = audioContext.createBiquadFilter();

        // Configure oscillator
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioContext.currentTime + duration);

        // Configure filter for bubble-like sound
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 2000;
        filterNode.Q.value = 1;

        // Configure gain (volume envelope)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

        // Connect nodes
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Play sound
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    // Create particle effect
    function createParticles(x, y) {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.animation = 'pop-particle 0.6s ease-out forwards';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    // Pop bubble function
    function popBubble(bubbleElement, index) {
        if (bubbleElement.classList.contains('pressed')) return;

        // Initialize audio context on first interaction
        initAudio();

        bubbleElement.classList.remove('unpressed');
        bubbleElement.classList.add('pressed');
        
        // Create sound with slight frequency variation
        const frequency = 600 + Math.random() * 400;
        createPopSound(frequency);
        
        // Create particle effect
        const rect = bubbleElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createParticles(x, y);
        
        poppedCount++;
        updateStats();
        
        // Check if all bubbles are popped
        if (poppedCount === totalBubbles) {
            setTimeout(() => {
                alert('🎉 Congratulations! You popped all the bubbles! 🎉');
            }, 500);
        }
    }

    // Update statistics
    function updateStats() {
        document.getElementById('poppedCount').textContent = poppedCount;
        document.getElementById('remainingCount').textContent = totalBubbles - poppedCount;
    }

    // Generate bubbles
    function generateBubbles() {
        const grid = document.getElementById('popGrid');
        grid.innerHTML = '';
        bubbles = [];
        
        for (let i = 0; i < totalBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble unpressed';
            bubble.addEventListener('click', () => popBubble(bubble, i));
            
            // Add touch support for mobile
            bubble.addEventListener('touchstart', (e) => {
                e.preventDefault();
                popBubble(bubble, i);
            });
            
            grid.appendChild(bubble);
            bubbles.push(bubble);
        }
    }

    // Reset game
    function resetGame() {
        poppedCount = 0;
        generateBubbles();
        updateStats();
        
        // Play a different sound for reset
        if (soundEnabled && audioContext) {
            createPopSound(400, 0.2);
        }
    }

    // Toggle sound
    function toggleSound() {
        soundEnabled = !soundEnabled;
        const statusElement = document.getElementById('soundStatus');
        statusElement.textContent = soundEnabled ? 'Sound On' : 'Sound Off';
        
        if (soundEnabled) {
            initAudio();
            createPopSound(600, 0.1);
        }
    }

    // Initialize game
    function initGame() {
        generateBubbles();
        updateStats();
    }

    // Start the game when page loads
    window.addEventListener('load', initGame);

    // Handle page visibility for audio context
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    });