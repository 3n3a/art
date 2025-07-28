// Game state
let poppedCount = 0;
let totalBubbles = 25;
let soundEnabled = true;
let popSound;
let bubbles = [];

// Initialize audio
function initAudio() {
if (!popSound) {
popSound = new Audio(’./pop.mp3’);
popSound.preload = ‘auto’;
popSound.volume = 0.7;
}
}

// Play pop sound from MP3 file
function createPopSound() {
if (!soundEnabled || !popSound) return;


// Clone the audio to allow multiple overlapping plays
const audioClone = popSound.cloneNode();
audioClone.volume = 0.5 + Math.random() * 0.3; // Random volume variation
audioClone.playbackRate = 0.8 + Math.random() * 0.4; // Random pitch variation

audioClone.play().catch(e => {
    console.log('Audio play failed:', e);
});


}

// Create particle effect
function createParticles(x, y) {
const colors = [’#FFD700’, ‘#FF6B6B’, ‘#4ECDC4’, ‘#45B7D1’, ‘#96CEB4’, ‘#FFEAA7’];


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
if (bubbleElement.classList.contains(‘pressed’)) return;


// Initialize audio context on first interaction
initAudio();

bubbleElement.classList.remove('unpressed');
bubbleElement.classList.add('pressed');

// Play pop sound with variation
createPopSound();

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
document.getElementById(‘poppedCount’).textContent = poppedCount;
document.getElementById(‘remainingCount’).textContent = totalBubbles - poppedCount;
}

// Generate bubbles
function generateBubbles() {
const grid = document.getElementById(‘popGrid’);
grid.innerHTML = ‘’;
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
if (soundEnabled && popSound) {
    const resetSound = popSound.cloneNode();
    resetSound.playbackRate = 0.6;
    resetSound.volume = 0.4;
    resetSound.play().catch(e => console.log('Reset sound failed:', e));
}


}

// Toggle sound
function toggleSound() {
soundEnabled = !soundEnabled;
const statusElement = document.getElementById(‘soundStatus’);
statusElement.textContent = soundEnabled ? ‘Sound On’ : ‘Sound Off’;


if (soundEnabled) {
    initAudio();
    createPopSound();
}


}

// Initialize game
function initGame() {
generateBubbles();
updateStats();
}

// Start the game when page loads
window.addEventListener(‘load’, initGame);

// Handle page visibility for audio
document.addEventListener(‘visibilitychange’, () => {
if (document.visibilityState === ‘visible’ && popSound) {
// Reinitialize audio if needed
initAudio();
}
});