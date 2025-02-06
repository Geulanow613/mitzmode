class MediaManager {
    constructor() {
        this.video = document.getElementById('backgroundVideo');
        this.stars = document.querySelectorAll('.star');
        this.initialized = false;
    }
    
    initializeBackgroundVideo() {
        if (this.video) {
            this.video.play().catch(error => {
                console.warn('Auto-play failed:', error);
                // Add play button for mobile
                const playButton = document.createElement('button');
                playButton.className = 'play-button';
                playButton.innerHTML = '▶';
                playButton.onclick = () => {
                    this.video.play();
                    playButton.remove();
                };
                document.body.appendChild(playButton);
            });
        }
        this.initialized = true;
    }
    
    async playRewardVideo(videoNumber) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'dialog video-dialog';
            
            dialog.innerHTML = `
                <div class="dialog-content">
                    <video id="rewardVideo" autoplay>
                        <source src="assets/rewards/reward${videoNumber}.mp4" type="video/mp4">
                    </video>
                    <button class="skip-button">Skip</button>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            const video = dialog.querySelector('#rewardVideo');
            const skipButton = dialog.querySelector('.skip-button');
            
            // For mobile devices that don't support autoplay
            video.play().catch(() => {
                video.controls = true;
            });
            
            const closeDialog = () => {
                dialog.classList.add('closing');
                setTimeout(() => {
                    dialog.remove();
                    resolve();
                }, 300);
            };
            
            video.onended = closeDialog;
            skipButton.onclick = () => {
                video.pause();
                closeDialog();
            };
        });
    }
    
    createSparkleEffect(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < CONFIG.ANIMATIONS.SPARKLE_COUNT; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = '✡';
            
            // Random position around the button
            const angle = (i / CONFIG.ANIMATIONS.SPARKLE_COUNT) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            sparkle.style.setProperty('--tx', `${tx}px`);
            sparkle.style.setProperty('--ty', `${ty}px`);
            
            sparkle.style.left = `${rect.left + rect.width / 2}px`;
            sparkle.style.top = `${rect.top + rect.height / 2}px`;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), CONFIG.ANIMATIONS.SPARKLE_DURATION);
        }
    }
    
    showLevelUpDialog(level) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog level-dialog';
        
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <button class="close-button">×</button>
                </div>
                <div class="dialog-body">
                    <h2 class="level-up-title">New Level Achieved!</h2>
                    <p class="level-name">${level.title}</p>
                    <div class="level-up-stars">
                        ${this._createStars(level)}
                    </div>
                    ${level.nextLevel ? `
                        <p class="next-level">
                            Next level: ${level.nextLevel.title}<br>
                            ${level.nextLevel.remaining} more mitzvot to go!
                        </p>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const closeButton = dialog.querySelector('.close-button');
        closeButton.onclick = () => {
            dialog.classList.add('closing');
            setTimeout(() => dialog.remove(), 300);
        };
        
        // Auto-close after animation
        setTimeout(() => closeButton.onclick(), CONFIG.ANIMATIONS.LEVEL_UP_DURATION);
    }
    
    _createStars(level) {
        const count = Object.values(CONFIG.LEVELS).findIndex(l => l.title === level.title) + 1;
        return '✡'.repeat(count);
    }

    animateStars() {
        if (!this.initialized) {
            console.warn('MediaManager not initialized yet');
            return;
        }
        
        console.log('Animating stars...');
        this.stars.forEach(star => {
            const delay = Math.random() * 2;
            const duration = 2 + Math.random() * 2;
            
            star.style.animation = 'none';
            star.offsetHeight; // Trigger reflow
            star.style.animation = `twinkle ${duration}s ${delay}s infinite`;
        });
    }
} 