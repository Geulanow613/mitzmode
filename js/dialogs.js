class DialogManager {
    /** Tracks which holy-light-flash variant fires next on Accept (0..3 cycle). */
    static _acceptFlashVariant = 0;

    static showMitzvahDialog(mitzvah, onAccept, onNext) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog mitzvah-dialog';
        
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <h2 style="width: 100%; text-align: center;">Mitzvah Opportunity</h2>
                    <button class="close-button">×</button>
                </div>
                <div class="dialog-body">
                    <p id="mitzvahText">${mitzvah.text}</p>
                    ${mitzvah.links && mitzvah.links.length > 0 ? `
                        <div class="mitzvah-links">
                            ${mitzvah.links.map(link => `
                                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="dialog-link">
                                    ${link.displayText || 'Learn More'}
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="dialog-footer">
                    <button id="acceptMitzvahButton" class="primary-button">Accept</button>
                    <button id="nextMitzvahButton" class="secondary-button">Next</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Add show animation class after a small delay
        setTimeout(() => dialog.classList.add('show-dialog'), 50);
        
        // Set up button handlers
        const acceptButton = dialog.querySelector('#acceptMitzvahButton');
        const nextButton = dialog.querySelector('#nextMitzvahButton');
        const closeButton = dialog.querySelector('.close-button');
        
        const createSparkles = (button) => {
            const rect = button.getBoundingClientRect();
            for (let i = 0; i < 12; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.textContent = '✡';
                
                const angle = (i / 12) * Math.PI * 2;
                const distance = 50 + Math.random() * 30;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                sparkle.style.left = `${rect.left + rect.width / 2}px`;
                sparkle.style.top = `${rect.top + rect.height / 2}px`;
                sparkle.style.setProperty('--tx', `${tx}px`);
                sparkle.style.setProperty('--ty', `${ty}px`);
                
                document.body.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 1000);
            }
        };
        
        acceptButton.onclick = () => {
            if (acceptButton.disabled) return;
            acceptButton.disabled = true;
            acceptButton.textContent = 'Accepted ✓';
            acceptButton.classList.add('accepted');
            createSparkles(acceptButton);
            DialogManager.playHolyLightFlash();
            onAccept(mitzvah);
        };
        
        nextButton.onclick = () => {
            const mitzvahText = dialog.querySelector('#mitzvahText');
            const mitzvahLinks = dialog.querySelector('.mitzvah-links');
            
            // Fade out current text
            mitzvahText.classList.add('fade-out');
            if (mitzvahLinks) mitzvahLinks.classList.add('fade-out');
            
            // Reset accept button
            acceptButton.disabled = false;
            acceptButton.textContent = 'Accept';
            acceptButton.classList.remove('accepted');
            
            // Call the next callback to get the next mitzvah
            onNext();
            
            // Fade in new text after a short delay
            setTimeout(() => {
                mitzvahText.classList.remove('fade-out');
                mitzvahText.classList.add('fade-in');
                if (mitzvahLinks) {
                    mitzvahLinks.classList.remove('fade-out');
                    mitzvahLinks.classList.add('fade-in');
                }
            }, 300);
        };
        
        closeButton.onclick = () => {
            dialog.classList.remove('show-dialog');
            setTimeout(() => dialog.remove(), 300);
        };

        // Add click outside to close
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.classList.remove('show-dialog');
                setTimeout(() => dialog.remove(), 300);
            }
        });
    }
    
    static showLevelUpDialog(level) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog level-dialog';
        
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <button class="close-button">×</button>
                </div>
                <div class="dialog-body">
                    <h2 class="title">New Level Achieved!</h2>
                    <p class="level-name">${level.title}</p>
                    <div class="stars">
                        ${this._createStars(level.title)}
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
        
        setTimeout(() => closeButton.onclick(), CONFIG.ANIMATIONS.LEVEL_UP_DURATION);
    }
    
    static showAboutDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'dialog about-dialog';
        
        dialog.innerHTML = `
            <div class="dialog-content">
                    <button class="close-button">×</button>
                <div class="dialog-body">
                    <p>This app is brought to you by Beardy Top Productions</p>
                    <img src="assets/beardy.png" alt="Beardy Top Productions Logo" class="beardy-logo">
                    <a href="https://www.beardy.top" target="_blank" class="dialog-link">www.beardy.top</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const closeButton = dialog.querySelector('.close-button');
        closeButton.onclick = () => {
            dialog.classList.add('closing');
            setTimeout(() => dialog.remove(), 300);
        };
    }
    
    static closeDialog(dialog) {
        dialog.classList.add('closing');
        setTimeout(() => {
            dialog.classList.add('hidden');
            dialog.classList.remove('closing');
        }, 300);
    }
    
    static createSparkleEffect(element) {
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
    
    static _createStars(level) {
        let starCount = 1; // Default to 1 star for unknown levels
        
        // Map level names to star counts. Ultimate tier renders its app-icon emblem
        // outside this helper, so it is not present in this table by design.
        const levelStars = {
            "Beginner": 1,
            "Ba'al Teshuva": 2,
            "Master Cholent Chef": 3,
            "Aspiring Kiddush Maker": 4,
            "Assistant Gabbai": 5,
            "Guy who hands out candy at shul": 6,
            "Western Wall Reveler": 7,
            "Sofer": 8,
            "Tzaddik": 9,
            "Living Sefer Torah": 10,
            "Eliyahu HaNavi": 11,
            "King David": 12,
            "Moshiach!!!": 13
        };

        if (levelStars.hasOwnProperty(level)) {
            starCount = levelStars[level];
        }

        const stars = '✡'.repeat(starCount);
        return `<div class="stars-display">${stars}</div>`;
    }

    static showCertificateDialog(count, level) {
        const isUltimate = level === 'Mitz Mode!';
        const dialog = document.createElement('div');
        dialog.className = 'dialog certificate-dialog' + (isUltimate ? ' ultimate' : '');

        // Ultimate tier replaces the stars row with the app icon (tap to replay finalreward.mp4).
        // Other tiers keep the classic ✡ star row.
        const emblemHTML = isUltimate
            ? `
                <div class="ultimate-icon-wrap" title="Replay">
                    <img src="assets/app_icon.png" alt="Mitz Mode" class="ultimate-app-icon">
                </div>
                <p class="ultimate-tagline">Legendary tier — thank you for lighting up the world.<br>Keep Going!</p>
              `
            : this._createStars(level);

        dialog.innerHTML = `
            <div class="dialog-content certificate-content">
                <div class="certificate-border">
                    <div class="certificate-header">
                        <div class="star-decoration">✡</div>
                        <h2>Certificate of Achievement</h2>
                        <div class="star-decoration">✡</div>
                    </div>
                    <div class="certificate-body">
                        <div class="scroll-decoration">📜</div>
                        <div class="certificate-text">
                            <div class="count-display">
                                <span class="number">${count}</span>
                                <span class="label">${count === 1 ? 'Mitzvah Completed' : 'Mitzvot Completed'}</span>
                            </div>
                            <div class="level-display">
                                <span class="label">Current Level:</span>
                                <span class="level-title">${level}</span>
                            </div>
                            ${emblemHTML}
                        </div>
                        <div class="torah-decoration">📜</div>
                    </div>
                    <div class="certificate-footer">
                        <div class="seal">
                            <div class="seal-star">✡</div>
                        </div>
                        <div class="signature-line">
                            <span class="signature-label">Certified by MitzMode™</span>
                        </div>
                    </div>
                </div>
                <button class="close-button fancy-close">×</button>
            </div>
        `;

        document.body.appendChild(dialog);

        // Add fancy animation class after a small delay to trigger the animation
        setTimeout(() => dialog.classList.add('show-certificate'), 100);

        const closeCertificate = () => {
            dialog.classList.remove('show-certificate');
            dialog.classList.add('hide-certificate');
            setTimeout(() => dialog.remove(), 500);
        };

        dialog.querySelector('.close-button').onclick = closeCertificate;
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) closeCertificate();
        });

        if (isUltimate) {
            const iconWrap = dialog.querySelector('.ultimate-icon-wrap');
            if (iconWrap) {
                iconWrap.addEventListener('click', () => {
                    closeCertificate();
                    if (window.app && typeof window.app.replayFinalRewardVideo === 'function') {
                        setTimeout(() => window.app.replayFinalRewardVideo(), 350);
                    }
                });
            }
        }
    }

    /**
     * Full-screen holy-light flash overlay played right after Accept.
     * Cycles 4 variants per tap: 0 diagonal L→R, 1 wide horizontal sheet,
     * 2 diagonal R→L, 3 bottom→top — mirrors Android MitzvahDialog.
     */
    static playHolyLightFlash() {
        const variant = DialogManager._acceptFlashVariant;
        DialogManager._acceptFlashVariant = (variant + 1) % 4;

        const overlay = document.createElement('div');
        overlay.className = `holy-light-flash variant-${variant}`;
        overlay.innerHTML = `
            <div class="holy-flash-ambient"></div>
            <div class="holy-flash-blade primary"></div>
            <div class="holy-flash-blade secondary"></div>
        `;
        document.body.appendChild(overlay);

        // Trigger animation on next frame so the initial transform/opacity sticks.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => overlay.classList.add('playing'));
        });

        const duration = (CONFIG && CONFIG.ANIMATIONS && CONFIG.ANIMATIONS.ACCEPT_FLASH_DURATION) || 1100;
        setTimeout(() => {
            overlay.classList.add('fading');
            setTimeout(() => overlay.remove(), 200);
        }, duration);
    }

    static showWhatIsAMitzvahDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'dialog whats-mitzvah';
        dialog.innerHTML = `
            <div class="dialog-content">
                <button class="close-button">×</button>
                <div class="dialog-header">
                    <h3>What's a Mitzvah?</h3>
                </div>
                <div class="dialog-body">
                    <p>The word mitzvah (מצוה) literally means "commandment." In Judaism, mitzvot are the 613 commandments given by G-d through the Torah, and also some extra mitzvot which our rabbis, through Divine inspiration, added on.</p>
                    
                    <p>While mitzvah means commandment, it also carries the deeper meaning of "connection." By performing a mitzvah, we fulfill G-d's will and connect with the Divine. It's like following instructions from a loved one; by doing so, you strengthen your bond with them.</p>
                    
                    <p>G-d is constantly sending down pure Heavenly Light which sustains the world and everything in it. If you go against His will, it's like putting an umbrella between yourself and this Light. But by performing mitzvot you can connect with the Heavenly Goodness that is G-d Himself, and experience Heaven on Earth- in a state you might like to call "Mitz Mode." It might not happen right away, but do a few mitzvot and see how you feel. This is just the beginning...</p>
                </div>
                <div class="dialog-footer">
                    <button class="primary-button">CLOSE</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const closeButtons = dialog.querySelectorAll('.close-button, .primary-button');
        closeButtons.forEach(button => {
            button.onclick = () => {
                dialog.classList.add('closing');
                setTimeout(() => dialog.remove(), 300);
            };
        });

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
            dialog.classList.add('closing');
            setTimeout(() => dialog.remove(), 300);
            }
        });
    }

    static async submitMitzvahSuggestion(mitzvahText, submitterName) {
        try {
            const response = await fetch('https://formspree.io/f/movjwkbe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: `New Mitzvah Suggestion`,
                    mitzvah: mitzvahText,
                    submitter: submitterName || 'Anonymous',
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to submit suggestion: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error('Failed to submit mitzvah suggestion:', error);
            return false;
        }
    }

    static showAddMitzvahDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <h2>Add a Mitzvah</h2>
                    <button class="close-button">×</button>
                </div>
                <div class="dialog-body">
                    <p>Have a mitzvah suggestion? Fill out the form below:</p>
                    <form id="addMitzvahForm">
                        <div class="form-group">
                            <label for="mitzvahText">Your Mitzvah:</label>
                            <textarea id="mitzvahText" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="submitterName">Your Name (optional):</label>
                            <input type="text" id="submitterName">
                        </div>
                        <button type="submit" class="primary-button">Submit</button>
                    </form>
                    <div id="submitStatus" class="submit-status"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const form = dialog.querySelector('#addMitzvahForm');
        const statusDiv = dialog.querySelector('#submitStatus');
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            const mitzvahText = form.querySelector('#mitzvahText').value;
            const submitterName = form.querySelector('#submitterName').value;
            
            const success = await this.submitMitzvahSuggestion(mitzvahText, submitterName);
            
            if (success) {
                statusDiv.textContent = 'Thank you! Your suggestion has been submitted.';
                statusDiv.className = 'submit-status success';
                setTimeout(() => {
                    dialog.classList.add('closing');
                    setTimeout(() => dialog.remove(), 300);
                }, 2000);
            } else {
                statusDiv.textContent = 'Sorry, there was an error submitting your suggestion. Please try again.';
                statusDiv.className = 'submit-status error';
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
            }
        };
        
        dialog.querySelector('.close-button').onclick = () => {
            dialog.classList.add('closing');
            setTimeout(() => dialog.remove(), 300);
        };
    }

    static showBlessingsDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'dialog blessings-dialog';
        
        // Combine all blessings data
        const blessings = {
            "Food Blessings": [
                {
                    title: "Hamotzi",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ",
                    english: "Blessed are You, Lord our God, King of the universe, who brings forth bread from the earth",
                    description: "For bread"
                },
                {
                    title: "Mezonot",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא מִינֵי מְזוֹנוֹת",
                    english: "Blessed are You, Lord our God, King of the universe, who creates various kinds of sustenance",
                    description: "For grain products (not bread)"
                },
                {
                    title: "Ha'etz",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הָעֵץ",
                    english: "Blessed are You, Lord our God, King of the universe, who creates the fruit of the tree",
                    description: "For tree fruits"
                },
                {
                    title: "Ha'adama",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הָאֲדָמָה",
                    english: "Blessed are You, Lord our God, King of the universe, who creates the fruit of the earth",
                    description: "For vegetables and ground fruits"
                }
            ],
            "Drink Blessings": [
                {
                    title: "Hagafen",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא פְּרִי הַגָּפֶן",
                    english: "Blessed are You, Lord our God, King of the universe, who creates the fruit of the vine",
                    description: "For wine and grape juice"
                },
                {
                    title: "Shehakol",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם שֶׁהַכֹּל נִהְיָה בִּדְבָרוֹ",
                    english: "Blessed are You, Lord our God, King of the universe, Who makes all things exist by His word",
                    description: "For drinks (except wine/grape juice)"
                }
            ],
            "After Food": [
                {
                    title: "Borei Nefashot",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא נְפָשׁוֹת רַבּוֹת וְחֶסְרוֹנָן עַל כָּל מַה שֶּׁבָּרָאתָ לְהַחֲיוֹת בָּהֶם נֶפֶשׁ כָּל חָי בָּרוּךְ חֵי הָעוֹלָמִים",
                    english: "Blessed are You, Lord our God, King of the universe, Who creates numerous living things with their deficiencies, for all that You have created with which to sustain the life of every being. Blessed is He who is the Life of the worlds",
                    description: "After-blessing for foods/drinks that don't require Birkat Hamazon or Al Hamichya"
                },
                {
                    title: "Al Hamichya (Three-Faceted Blessing)",
                    hebrew: "",
                    english: "",
                    description: "Required after eating cake, cookies, pasta, or other grain products (not bread); wine or grape juice; dates, grapes, figs, pomegranates, or olives. For the full text, <a href='https://www.chabad.org/library/article_cdo/aid/279847/jewish/Al-Hamichyah-The-After-Blessing-on-Special-Foods.htm' target='_blank' class='dialog-link'>click here</a>"
                },
                {
                    title: "Birkat Hamazon (Grace After Meals)",
                    hebrew: "",
                    english: "",
                    description: "Required after eating bread. For the full text, <a href='https://www.chabad.org/library/article_cdo/aid/136676/jewish/EnglishHebrew-PDF-of-Birkat-Hamazon.htm' target='_blank' class='dialog-link'>click here</a>"
                }
            ],
            "Natural Phenomena": [
                {
                    title: "On Thunder",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם שֶׁכֹּחוֹ וּגְבוּרָתוֹ מָלֵא עוֹלָם",
                    english: "Blessed are You G-od our G-d, King of the Universe whose power and might fill the world",
                    description: "When hearing thunder"
                },
                {
                    title: "On Lightning",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית",
                    english: "Blessed are You G-od our G-d, King of the Universe who does the work of creation",
                    description: "When seeing lightning"
                },
                {
                    title: "On Seeing an Ocean",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית",
                    english: "Blessed are You G-od our G-d, King of the Universe who does the work of creation",
                    description: "For seeing any natural ocean or sea (like the Kinneret). Say this blessing again if you see a different ocean. Note: Don't say this blessing if you live near the ocean."
                },
                {
                    title: "On Seeing the Mediterranean Sea",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית שֶׁעָשָׂה אֶת הַיָּם הַגָּדוֹל",
                    english: "Blessed are You G-od our G-d, King of the Universe who does the work of creation, who made the great sea",
                    description: "A special blessing for the Mediterranean Sea"
                },
                {
                    title: "On Seeing Rivers and Waterfalls",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית",
                    english: "Blessed are You G-od our G-d, King of the Universe who does the work of creation",
                    description: "For seeing natural large rivers (like Niagara Falls). Don't say this blessing if the river has been modified by humans."
                },
                {
                    title: "On Seeing Unique Mountains",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית",
                    english: "Blessed are You G-od our G-d, King of the Universe who does the work of creation",
                    description: "For seeing extraordinary mountains (like Mount Everest, the Alps). Don't say this blessing if you've seen the mountain in the last 30 days or from an airplane."
                },
                {
                    title: "On Seeing a Desert",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית",
                    english: "Blessed are You G-od our G-d, King of the Universe who does the work of creation",
                    description: "For seeing large, dangerous deserts far from settlements"
                },
                {
                    title: "On Seeing Astronomical Events",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית",
                    english: "Blessed are You G-od our G-d, King of the Universe who does the work of creation",
                    description: "For seeing comets, meteors, or shooting stars (only once per night for multiple sightings)"
                },
                {
                    title: "On Experiencing Natural Events",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עוֹשֶׂה מַעֲשֵׂה בְרֵאשִׁית",
                    english: "Blessed are You G-od our G-d, King of the Universe who does the work of creation",
                    description: "For experiencing earthquakes (say again if there's a break between them) or strong winds like hurricanes and tornadoes"
                }
            ],
            "Other Blessings": [
                {
                    title: "Asher Yatzar",
                    hebrew: "בָּרוּךְ אַתָּה ה' אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם אֲשֶׁר יָצַר אֶת הָאָדָם בְּחָכְמָה וּבָרָא בוֹ נְקָבִים נְקָבִים חֲלוּלִים חֲלוּלִים גָּלוּי וְיָדוּעַ לִפְנֵי כִסֵּא כְבוֹדֶךָ שֶׁאִם יִפָּתֵחַ אֶחָד מֵהֶם אוֹ יִסָּתֵם אֶחָד מֵהֶם אִי אֶפְשַׁר לְהִתְקַיֵּם וְלַעֲמוֹד לְפָנֶיךָ אֲפִילוּ שָׁעָה אֶחָת בָּרוּךְ אַתָּה ה' רוֹפֵא כָל בָּשָׂר וּמַפְלִיא לַעֲשׂוֹת",
                    english: "Blessed are You, Lord our God, King of the universe, who formed man with wisdom and created within him many openings and many hollow spaces. It is obvious and known before Your Throne of Glory that if even one of them would be opened, or if even one of them would be sealed, it would be impossible to survive and to stand before You even for one hour. Blessed are You, Lord, who heals all flesh and acts wondrously",
                    description: "After using the bathroom"
                }
            ],
            "Travelers Prayer": [
                {
                    title: "תפילת הדרך",
                    hebrew: "יְהִי רָצוֹן מִלְּפָנֶיךָ ה׳ אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ שֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם וְתַצְעִידֵנוּ לְשָׁלוֹם וְתַדְרִיכֵנוּ לְשָׁלוֹם׃ וְתִסְמְכֵנוּ לְשָׁלוֹם וְתַגִּיעֵנוּ לִמְחוֹז חֶפְצֵנוּ לְחַיִּים וּלְשִׂמְחָה וּלְשָׁלוֹם׃ וְתַצִּילֵנוּ מִכַּף כָּל אוֹיֵב וְאוֹרֵב וְלִסְטִים וְחַיּוֹת רָעוֹת בַּדֶּרֶךְ וּמִכָּל מִינֵי פֻּרְעָנִיּוֹת הַמִּתְרַגְּשׁוֹת לָבוֹא לָעוֹלָם׃ וְתִשְׁלַח בְּרָכָה בְּכָל מַעֲשֵׂה יָדֵינוּ וְתִתְּנֵנוּ לְחֵן וּלְחֶסֶד וּלְרַחֲמִים בְּעֵינֶיךָ וּבְעֵינֵי כָל רוֹאֵינוּ׃ וְתִשְׁמַע קוֹל תַּחֲנוּנֵינוּ כִּי אֵל שׁוֹמֵעַ תְּפִלָּה וְתַחֲנוּן אָתָּה׃ בָּרוּךְ אַתָּה ה׳ שׁוֹמֵעַ תְּפִלָּה׃",
                    english: "May it be Your will, Lord our God and God of our ancestors, that You lead us toward peace, guide our footsteps toward peace, and make us reach our desired destination for life, gladness, and peace. May You rescue us from the hand of every foe, ambush along the way, and from all manner of punishments that assemble to come to earth. May You send blessing in our handiwork, and grant us grace, kindness, and mercy in Your eyes and in the eyes of all who see us. May You hear the voice of our supplication because You are God Who hears prayer and supplication. Blessed are You, Lord, Who hears prayer.",
                    description: "Prayer for safe travel"
                }
            ]
        };

        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <h2>Blessings</h2>
                    <button class="close-button">×</button>
                </div>
                <div class="dialog-body">
                    <div class="controls-container">
                        <!-- Text Controls -->
                        <div class="text-controls">
                            <button class="text-size-button decrease-text">A-</button>
                            <button class="text-size-button increase-text">A+</button>
                            <button class="toggle-english">Show English</button>
                        </div>

                        <!-- Quick Navigation -->
                        <div class="quick-nav">
                            <div class="nav-header">
                                <span class="nav-title">Quick Navigation</span>
                                <button class="nav-close">Hide</button>
                            </div>
                            <div class="quick-nav-links">
                                ${Object.keys(blessings).map(category => `
                                    <a href="#${category.replace(/\s+/g, '-')}" class="quick-nav-link">${category}</a>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="main-content">
                        ${Object.entries(blessings).map(([category, items]) => `
                            <div class="blessing-category" id="${category.replace(/\s+/g, '-')}">
                                <h3>${category}</h3>
                                ${items.map(blessing => `
                                    <div class="blessing-card">
                                        <h4>${blessing.title}</h4>
                                        <p class="description">${blessing.description}</p>
                                        ${blessing.hebrew ? `<p class="hebrew" dir="rtl">${blessing.hebrew}</p>` : ''}
                                        ${blessing.english ? `<p class="english" style="display: none">${blessing.english}</p>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Handle text size controls
        let fontSize = 1.0;
        const hebrewTexts = dialog.querySelectorAll('.hebrew');
        const englishTexts = dialog.querySelectorAll('.english');
        
        dialog.querySelector('.decrease-text').onclick = () => {
            fontSize = Math.max(0.8, fontSize - 0.1);
            hebrewTexts.forEach(text => text.style.fontSize = `${fontSize}em`);
            englishTexts.forEach(text => text.style.fontSize = `${fontSize}em`);
        };
        
        dialog.querySelector('.increase-text').onclick = () => {
            fontSize = Math.min(2.0, fontSize + 0.1);
            hebrewTexts.forEach(text => text.style.fontSize = `${fontSize}em`);
            englishTexts.forEach(text => text.style.fontSize = `${fontSize}em`);
        };

        // Handle English toggle
        let showEnglish = false;
        const toggleButton = dialog.querySelector('.toggle-english');
        toggleButton.onclick = () => {
            showEnglish = !showEnglish;
            englishTexts.forEach(text => text.style.display = showEnglish ? 'block' : 'none');
            toggleButton.textContent = showEnglish ? 'Hide English' : 'Show English';
        };

        // Handle quick navigation
        dialog.querySelectorAll('.quick-nav-link').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = dialog.querySelector(`#${targetId}`);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            };
        });

        // Handle closing
        const closeDialog = () => {
        dialog.classList.add('closing');
        setTimeout(() => dialog.remove(), 300);
        };

        dialog.querySelector('.close-button').onclick = closeDialog;
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                closeDialog();
            }
        });

        // After the dialog is created, add this event handler:
        const navCloseButton = dialog.querySelector('.nav-close');
        const quickNav = dialog.querySelector('.quick-nav');
        let isNavHidden = false;
        
        navCloseButton.onclick = () => {
            isNavHidden = !isNavHidden;
            quickNav.classList.toggle('hidden');
            navCloseButton.textContent = isNavHidden ? 'Show' : 'Hide';
        };
    }
} 