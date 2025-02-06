// Add required items constants at the top of the file
const MALE_REQUIRED_ITEMS = [
    "Ritual hand washing",
    "Have Mezuzot on your doorposts",
    "Wear a Kippah (head covering)",
    "Put on Tefillin during morning prayers (except Shabbat/Festivals)",
    "Wear Tzitzit (recommended for divine protection)",
    "Keep Kosher",
    "Morning Blessings (Birchot HaShachar)",
    "Torah Blessings + minimal Torah study",
    "Minimum Pesukei D'Zimra (Baruch She'amar, Ashrei, Yishtabach)",
    "Morning Shema with its blessings",
    "Shemoneh Esrei",
    "Mincha - Shemoneh Esrei",
    "Evening Shema with its blessings",
    "Maariv Shemoneh Esrei",
    "Bedtime Shema (first paragraph - though recommended to say entire Shema for spiritual protection)",
    "Hamapil blessing (according to many opinions)",
    "Prepare for and observe Shabbat and Festivals",
    "Say 100 brachot (blessings) today"
];

const FEMALE_REQUIRED_ITEMS = [
    "Ritual hand washing",
    "Have Mezuzot on your doorposts",
    "At least one prayer daily (typically morning)",
    "Cover hair in public (if married)",
    "Modesty (Tznius)",
    "Blessings before food",
    "Blessings after food", 
    "Asher Yatzar after using bathroom",
    "Keep Kosher",
    "Family Purity Laws (if married)",
    "Prepare for and observe Shabbat and Festivals",
    "Torah Study"
];

class MitzMode {
    constructor() {
        console.log('MitzMode constructor called');
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isLowBandwidth = false;
        
        this.mitzvotList = [];
        this.currentIndex = 0;
        this.storage = new StorageManager();
        
        // Initialize media manager
        console.log('Initializing MediaManager...');
        this.mediaManager = new MediaManager();
        window.mediaManager = this.mediaManager; // Store reference globally
        
        // Check network conditions
        this.checkNetworkConditions();
        
        // Initialize media first
        this.mediaManager.initializeBackgroundVideo();
        this.mediaManager.animateStars();
        
        // Then initialize UI and load data
        this.initializeUI();
        this.loadMitzvotData().catch(error => {
            console.error('Failed to load mitzvot data:', error);
            this.showNotification('Failed to load mitzvot. Please refresh the page or try again later.', 'error');
        });
        this.updateMitzvahCount();

        // Add mobile class if needed
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
        }
    }

    async checkNetworkConditions() {
        try {
            if ('connection' in navigator) {
                const connection = navigator.connection;
                this.isLowBandwidth = connection.saveData || 
                                    connection.effectiveType === 'slow-2g' || 
                                    connection.effectiveType === '2g';
            }
            
            if (this.isLowBandwidth) {
                document.body.classList.add('low-bandwidth');
                const bgVideo = document.getElementById('bgVideo');
                if (bgVideo) {
                    bgVideo.removeAttribute('autoplay');
                    bgVideo.pause();
                }
            }
        } catch (error) {
            console.warn('Network check failed:', error);
        }
    }
    
    enableMainButton() {
        const mainMitzvahButton = document.getElementById('mainMitzvahButton');
        if (mainMitzvahButton) {
            mainMitzvahButton.disabled = false;
            mainMitzvahButton.classList.remove('disabled');
        }
    }
    
    async loadMitzvotData() {
        try {
            // Load local mitzvot
            const localResponse = await fetch('data/mitzvot.json');
            console.log('Local response status:', localResponse.status);
            
            if (!localResponse.ok) {
                throw new Error(`HTTP error! status: ${localResponse.status}`);
            }
            
            const localData = await localResponse.json();
            console.log('Local data loaded:', localData);
            this.mitzvotList = localData.mitzvot;
            console.log(`Loaded ${this.mitzvotList.length} local mitzvot`);

            // Load cloud mitzvot from mitzvotcloud.json
            try {
                console.log('Attempting to load cloud mitzvot...');
                const cloudResponse = await fetch('mitzvotcloud.json');

                if (cloudResponse.ok) {
                    const cloudData = await cloudResponse.json();
                    if (cloudData.mitzvot && Array.isArray(cloudData.mitzvot)) {
                        // Add cloud mitzvot to the existing list
                        this.mitzvotList = [...this.mitzvotList, ...cloudData.mitzvot];
                        console.log(`Added ${cloudData.mitzvot.length} cloud mitzvot`);
                    }
                } else {
                    console.error('Failed to load cloud mitzvot:', cloudResponse.status);
                }
            } catch (error) {
                console.error('Failed to load cloud mitzvot:', error);
            }

            // Shuffle the mitzvot list
            console.log('Shuffling mitzvot list...');
            this.shuffleMitzvotList();
            console.log('Mitzvot list shuffled, first item:', this.mitzvotList[0]);

            // Enable the main button after loading
            console.log('Enabling main mitzvah button');
            this.enableMainButton();
        } catch (error) {
            console.error('Error loading mitzvot:', error);
        }
    }
    
    initializeUI() {
        console.log('Initializing UI...');
        
        // Reset instruction text visibility and add close button handler
        const instructionText = document.getElementById('mitzvahInstruction');
        if (instructionText) {
            instructionText.classList.remove('fade-out');
            const closeButton = instructionText.querySelector('.instruction-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    instructionText.classList.add('fade-out');
                });
            }
        }
        
        // Initialize buttons
        const mainMitzvahButton = document.getElementById('mainMitzvahButton');
        const addMitzvahButton = document.getElementById('addMitzvahButton');
        const mitzvahInfoButton = document.getElementById('mitzvahInfoButton');
        const checklistButton = document.getElementById('checklistButton');
        const aboutButton = document.getElementById('aboutButton');
        const blessingsButton = document.getElementById('blessingsButton');
        const mitzvotCounter = document.getElementById('mitzvotCounter');

        console.log('Initializing UI...');
        console.log('mainMitzvahButton:', mainMitzvahButton);

        // Use click event instead of unload
        if (mainMitzvahButton) {
            console.log('Adding click listener to mainMitzvahButton');
            // Remove any existing listeners first
            mainMitzvahButton.replaceWith(mainMitzvahButton.cloneNode(true));
            const newMainMitzvahButton = document.getElementById('mainMitzvahButton');
            
            newMainMitzvahButton.addEventListener('click', () => {
                console.log('Main mitzvah button clicked');
                this.handleMitzvahButtonClick();
            });
            
            this.initializeMitzvahButton(newMainMitzvahButton);
        } else {
            console.error('mainMitzvahButton not found in DOM');
        }

        if (addMitzvahButton) {
            // Remove any existing listeners first
            addMitzvahButton.replaceWith(addMitzvahButton.cloneNode(true));
            const newAddMitzvahButton = document.getElementById('addMitzvahButton');
            
            newAddMitzvahButton.addEventListener('click', (e) => {
                e.preventDefault();
                DialogManager.showAddMitzvahDialog();
            }, { passive: false });
        }

        if (mitzvahInfoButton) {
            // Remove any existing listeners first
            mitzvahInfoButton.replaceWith(mitzvahInfoButton.cloneNode(true));
            const newMitzvahInfoButton = document.getElementById('mitzvahInfoButton');
            
            newMitzvahInfoButton.addEventListener('click', () => {
                DialogManager.showWhatIsAMitzvahDialog();
            }, { passive: true });
        }

        if (checklistButton) {
            // Remove any existing listeners first
            checklistButton.replaceWith(checklistButton.cloneNode(true));
            const newChecklistButton = document.getElementById('checklistButton');
            
            newChecklistButton.addEventListener('click', (e) => {
                e.preventDefault();
            const checklist = document.getElementById('dailyChecklist');
                if (checklist) {
                    checklist.classList.remove('hidden');
                    this.initializeDailyChecklist();
                }
            }, { passive: false });
        }

        if (aboutButton) {
            // Remove any existing listeners first
            aboutButton.replaceWith(aboutButton.cloneNode(true));
            const newAboutButton = document.getElementById('aboutButton');
            
            newAboutButton.addEventListener('click', (e) => {
                e.preventDefault();
                DialogManager.showAboutDialog();
            }, { passive: false });
        }

        if (blessingsButton) {
            // Remove any existing listeners first
            blessingsButton.replaceWith(blessingsButton.cloneNode(true));
            const newBlessingsButton = document.getElementById('blessingsButton');
            
            newBlessingsButton.addEventListener('click', (e) => {
                e.preventDefault();
                DialogManager.showBlessingsDialog();
            }, { passive: false });
        }

        if (mitzvotCounter) {
            // Remove any existing listeners first
            mitzvotCounter.replaceWith(mitzvotCounter.cloneNode(true));
            const newMitzvotCounter = document.getElementById('mitzvotCounter');
            
            newMitzvotCounter.addEventListener('click', (e) => {
                e.preventDefault();
            const count = this.storage.getCompletedMitzvot().length;
            const level = this.getCurrentLevel(count);
            DialogManager.showCertificateDialog(count, level);
            }, { passive: false });
        }

        // Add beforeunload event listener for any cleanup needed
        window.addEventListener('beforeunload', (e) => {
            // Save any necessary state
            this.storage.saveState();
        }, { passive: true });
    }
    
    showNextMitzvah() {
        // If mitzvotList is empty, bail out
        if (!this.mitzvotList || this.mitzvotList.length === 0) {
            console.error('No mitzvot available');
            return;
        }

        // Use currentIndex for the mitzvah to show
        const currentIndex = this.currentIndex;
        const mitzvah = this.mitzvotList[currentIndex];

        // Display the dialog
        DialogManager.showMitzvahDialog(
            mitzvah,
            // Accept callback
            (acceptedMitzvah) => {
                // Mark it as completed
                const newCount = this.storage.addCompletedMitzvah(acceptedMitzvah);
        this.updateMitzvahCount();
                // [Potentially handle video or level-up here]

                // Move to next AFTER accept
                this.currentIndex = (this.currentIndex + 1) % this.mitzvotList.length;
            },
            // Next callback
            () => {
                // Move to next AFTER "Next"
                this.currentIndex = (this.currentIndex + 1) % this.mitzvotList.length;

                // Close current mitzvah dialog
                const currentDialog = document.querySelector('.mitzvah-dialog');
                if (currentDialog) currentDialog.remove();

                // Show next
                this.showNextMitzvah();
            }
        );
    }
    
    handleAccept(mitzvah) {
        this.storage.addCompletedMitzvah(mitzvah);
        this.updateMitzvahCount();
        // No index increment here - handled in showNextMitzvah
    }
    
    moveToNextMitzvah() {
        this.currentIndex = (this.currentIndex + 1) % this.mitzvotList.length;
    }
    
    updateMitzvahCount() {
        const count = this.storage.getCompletedMitzvot().length;
        const countElement = document.getElementById('mitzvahCount');
        if (countElement) {
        countElement.textContent = count;
        }
        
        const level = this.getCurrentLevel(count);
        const levelElement = document.getElementById('currentLevel');
        if (levelElement) {
        levelElement.textContent = level;
        }
    }
    
    initializeDailyChecklist() {
        const checklist = this.storage.getDailyChecklist();
        const checklistContainer = document.getElementById('dailyChecklist');
        
        // Clear old items
        checklistContainer.innerHTML = '';

        // Add gender tabs with close button
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'gender-tabs';
        tabsContainer.innerHTML = `
            <button class="tab-button active" data-gender="male">Men's Mitzvot</button>
            <button class="tab-button" data-gender="female">Women's Mitzvot</button>
            <button class="close-button">×</button>
        `;
        checklistContainer.appendChild(tabsContainer);

        // Add close button handler
        tabsContainer.querySelector('.close-button').onclick = () => {
            checklistContainer.classList.add('hidden');
        };

        // Create content containers for each gender
        const maleContent = document.createElement('div');
        maleContent.className = 'gender-content active';
        maleContent.id = 'maleContent';

        const femaleContent = document.createElement('div');
        femaleContent.className = 'gender-content';
        femaleContent.id = 'femaleContent';

        // Add explainer text at the top of each gender content
        const explainerText = document.createElement('div');
        explainerText.className = 'guide-text';
        explainerText.innerHTML = `
            <p>This guide is for beginners to understand the basic requirements of Torah-observant Jewish life. Take it one step at a time and always consult with a rabbi for proper guidance.</p>
        `;
        maleContent.appendChild(explainerText.cloneNode(true));
        femaleContent.appendChild(explainerText.cloneNode(true));

        // Add clear buttons to each gender content
        const maleClearButton = document.createElement('button');
        maleClearButton.className = 'clear-button';
        maleClearButton.textContent = 'Clear All';
        maleClearButton.onclick = () => {
            this.storage.clearDailyChecklist();
            this.initializeDailyChecklist();
        };
        maleContent.appendChild(maleClearButton);

        const femaleClearButton = maleClearButton.cloneNode(true);
        femaleClearButton.onclick = maleClearButton.onclick;
        femaleContent.appendChild(femaleClearButton);

        // Add sections to male content in the correct order
        const dailyMitzvotSection = this.createSection('Daily Mitzvot', [
            { text: 'Ritual hand washing', explanation: 'Upon waking:\n• Pour water from a cup 3 times on right hand\n• Pour water from a cup 3 times on left hand\n• Continue alternating between hands until each hand is washed 3 times\n• Say the blessing \'Al Netilat Yadayim\'\n\nSimilar hand washing is required before prayer times throughout the day, though without a blessing. This washing helps prepare us to connect with G-d in a state of ritual purity.' },
            { text: 'Wear a Kippah (head covering)', explanation: 'Jewish men wear a kippah (skullcap) as a sign of respect and acknowledgment that G-d is above us. \n\nWhile some authorities consider it a custom rather than a strict requirement, wearing a kippah is universally practiced by observant Jewish men and boys.\n\nIt serves as a constant reminder of G-d\'s presence and our duty to live according to His will.' },
            { text: 'Put on Tefillin during morning prayers (except Shabbat/Festivals)', explanation: 'Tefillin are sacred black leather boxes containing Torah verses, worn on the arm and head during morning prayers. They help us to direct our thoughts and actions to G-d\'s service, and connect us to Him. They can be worn later if not possible during morning prayers (but not at night).\n\nWhile tefillin are a significant investment, they are one of the most important items a Jewish man can own. It\'s crucial to purchase only certified kosher tefillin from a reliable source, as there are many non-kosher ones on the market. Consult your local Chabad/Orthodox rabbi for guidance on purchasing the right set and learning how to put them on properly.' },
            { text: 'Wear Tzitzit (recommended for divine protection)', explanation: 'Tzitzit are special fringes worn on a four-cornered garment. While technically only required when wearing such a garment, it\'s highly recommended to wear a tallit katan all day and tallit gadol during morning prayers for spiritual protection.' },
            { text: 'Have Mezuzot on your doorposts', explanation: 'A mezuzah is a sacred scroll containing Torah verses that we affix to our doorposts:\n\n• Every Jewish home requires kosher mezuzot on all appropriate doorways\n• The mezuzah provides spiritual protection and blessings for the home and its inhabitants\n• It\'s crucial to use only certified kosher scrolls - many non-kosher ones exist in the market\n• Consult your local Chabad/Orthodox rabbi about which doorways need mezuzot and where to obtain kosher ones', link: { displayText: 'Learn more about mezuzot', url: 'https://www.chabad.org/library/article_cdo/aid/278476/jewish/Mezuzah.htm' } },
            { text: 'Keep Kosher', explanation: 'Keeping kosher involves following Jewish dietary laws:\n\n• Eating only kosher animals (e.g., no pork or shellfish)\n• Using only kosher-certified products\n• Separating meat and dairy completely\n• Using separate dishes, utensils, and appliances for meat and dairy\n• Waiting the required time between eating meat and dairy\n• Using only kosher wine and grape products\n• Special rules for Passover\n\nThese laws elevate eating into a spiritual act and help maintain Jewish identity. Please consult with a rabbi for guidance on implementing kosher practices in your home.' }
        ]);

        const morningSection = this.createSection('Morning Prayer (Shacharit)', [
            { text: 'Morning Blessings (Birchot HaShachar)', explanation: 'These are blessings said at the start of the day thanking G-d for basic functions and needs. They help us begin each day with gratitude and awareness. It is recommended to say Korbanot (the sacrificial service passages), but at minimum many rabbis require saying the Parsha HaTamid, the Torah verses explaining the daily tamid offering.' },
            { text: 'Torah Blessings + minimal Torah study', explanation: 'Before studying Torah, we recite blessings acknowledging G-d as the giver of Torah. We then fulfill the daily obligation to study Torah, by reading the passages that follow in the siddur.' },
            { text: 'Minimum Pesukei D\'Zimra', explanation: 'These are verses of praise from Psalms and other sources that prepare us for prayer. The minimum is Baruch She\'amar, Ashrei, and Yishtabach.' },
            { text: 'Morning Shema with its blessings', explanation: 'The Shema is a central declaration of Jewish faith, recited with blessings before and after. It must be said within the first quarter of the day.' },
            { text: 'Shemoneh Esrei/Tachanun', explanation: 'Also called Amidah, this is the central prayer consisting of 19 blessings (18 originally). It\'s recited standing, facing Jerusalem, three times daily.\n\nOn most weekdays, Tachanun (prayers of repentance) is recited immediately after. However, it\'s omitted on festive days and certain other occasions. Follow your siddur\'s instructions or the congregation if you\'re at synagogue.' }
        ]);

        const afternoonSection = this.createSection('Afternoon Prayer', [
            { text: 'Mincha - Shemoneh Esrei/Tachanun', explanation: 'The afternoon prayer service, centered around the Shemoneh Esrei. It should be said after midday and before sunset. This prayer helps us pause during our busy day to reconnect with G-d.\n\nLike in the morning service, Tachanun is recited after Shemoneh Esrei on most weekdays, but omitted on festive days and certain occasions. Follow your siddur\'s instructions or the congregation if you\'re at synagogue.' }
        ]);

        const eveningSection = this.createSection('Evening Requirements', [
            { text: 'Evening Shema with its blessings', explanation: 'The evening Shema must be recited after nightfall. Like the morning Shema, it\'s surrounded by appropriate blessings. This mitzvah can be fulfilled any time during the night.' },
            { text: 'Maariv Shemoneh Esrei', explanation: 'The evening Shemoneh Esrei prayer. While technically optional according to some opinions, it has become obligatory through universal Jewish custom.' },
            { text: 'Bedtime Shema (first paragraph - though recommended to say entire Shema for spiritual protection)', explanation: 'Reciting Shema before sleep provides spiritual protection through the night. While only the first paragraph is strictly required, it\'s recommended to say the entire Shema and associated prayers for maximum protection.' },
            { text: 'Hamapil blessing (according to many opinions)', explanation: 'A beautiful blessing thanking G-d for the gift of sleep and asking for protection through the night. While some consider it optional, many authorities recommend saying it nightly. Check your siddur for the text.' }
        ]);

        const shabbatSection = this.createSection('Shabbat and Festivals', [
            { text: 'Prepare for and observe Shabbat and Festivals', explanation: 'Shabbat and Jewish Festivals are sacred times that elevate us spiritually:\n\n• Light candles before sunset to welcome these holy days\n• Prepare food and our home in advance\n• Refrain from work activities (melacha) such as using electronics, driving, handling money etc.\n• Enjoy festive meals with family and community\n• Focus on prayer, Torah study, and spiritual growth\n\nProper observance of these days can bring our souls unique feelings of holiness and closeness with G-d that are unattainable during regular days. These elevated spiritual states can be experienced through proper observance of the laws.' }
        ]);

        const blessingsSection = this.createSection('Daily Blessings', [
            { text: 'Say 100 brachot (blessings) today', explanation: 'The goal is to say 100 blessings each day. On weekdays, this happens naturally through daily prayers and food blessings. On Shabbat and Festivals when prayers are shorter, make up the count with blessings on snacks and fragrances. On Yom Kippur, when we don\'t eat, there are other ways to make up the count.', link: { displayText: 'Click here for more information', url: 'https://aish.com/43-100-blessings-each-day/' } }
        ]);

        // Add sections in the correct order
        maleContent.appendChild(dailyMitzvotSection);
        maleContent.appendChild(morningSection);
        maleContent.appendChild(afternoonSection);
        maleContent.appendChild(eveningSection);
        maleContent.appendChild(blessingsSection);
        maleContent.appendChild(shabbatSection);

        // Create Special Mitzvot Notes section
        const specialMitzvotSection = document.createElement('div');
        specialMitzvotSection.className = 'special-mitzvot-notes';
        specialMitzvotSection.innerHTML = `
            <h3>Special Mitzvot Notes</h3>
            <p>There are many additional mitzvot that apply at special times. Here are just a few examples:</p>
            <ul>
                <li>Monthly: Kiddush HaLevana, Rosh Chodesh</li>
                <li>Seasonal: Counting the Omer (between Pesach and Shavuot)</li>
                <li>Festivals: Eating Matzah, Hearing Shofar, Lulav/Etrog, Hannukah, Purim</li>
            </ul>
            <p>To check which major upcoming Jewish events/holidays/mitzvot are happening currently, check out the <a href="https://www.chabad.org/calendar/view/month.htm" target="_blank">Chabad.org calendar</a>.</p><br>
            <p>This list covers basic requirements in terms of prayer, blessings, and lifestyle needed to fulfill daily Torah and rabbinic mitzvot. However, there are many other mitzvot in areas such as business, proper speech, relationships, and more that are beyond the scope of this list. Please consult a rabbi and reliable Jewish sources to learn about all the mitzvot relevant to your situation.</p>
        `;

        // Add siddur recommendation section
        const siddurimSection = document.createElement('div');
        siddurimSection.className = 'recommended-resources';
        siddurimSection.innerHTML = `
            <h3>Recommended Resources</h3>
            <p>Note: To properly fulfill these mitzvot, you'll need a good siddur (prayer book). There are several options available:</p>
            <ul>
                <li>Many free siddur apps are available on your phone's app store</li>
                <li>ArtScroll offers nice printed siddurim in various formats</li>
            </ul>
            <a href="https://www.artscroll.com/Categories/PBK.html" target="_blank" class="dialog-link">Browse printed siddurim options</a>
        `;

        // Add warning about electronics
        const warningSection = document.createElement('div');
        warningSection.className = 'warning-section';
        warningSection.innerHTML = `
            <p class="warning-text">Please refrain from using phones, computers, or any electronics during Shabbat and Festivals, as these are holy days of complete rest.</p>
        `;

        // Add sections in the correct order at the bottom
        maleContent.appendChild(specialMitzvotSection.cloneNode(true));
        maleContent.appendChild(siddurimSection.cloneNode(true));
        maleContent.appendChild(warningSection.cloneNode(true));

        // Add content containers to checklist
        checklistContainer.appendChild(maleContent);
        checklistContainer.appendChild(femaleContent);

        // Add tab switching functionality
        const tabs = tabsContainer.querySelectorAll('.tab-button');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const gender = tab.dataset.gender;
                document.querySelectorAll('.gender-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${gender}Content`).classList.add('active');
            });
        });

        // Load saved state
        const savedChecklist = this.storage.getDailyChecklist();
        if (savedChecklist) {
            Object.entries(savedChecklist).forEach(([itemText, isChecked]) => {
                const checkbox = checklistContainer.querySelector(`input[data-text="${itemText}"]`);
                if (checkbox) {
                    checkbox.checked = isChecked;
                }
            });
        }

        // Add female-specific sections first
        const femaleMitzvotSection = this.createSection('Daily Mitzvot', [
            { text: 'Ritual hand washing', explanation: 'Upon waking:\n• Pour water from a cup 3 times on right hand\n• Pour water from a cup 3 times on left hand\n• Continue alternating between hands until each hand is washed 3 times\n• Say the blessing \'Al Netilat Yadayim\'\n\nSimilar hand washing is required before prayer times throughout the day, though without a blessing. This washing helps prepare us to connect with G-d in a state of ritual purity.' },
            { text: 'Have Mezuzot on your doorposts', explanation: 'A mezuzah is a sacred scroll containing Torah verses that we affix to our doorposts:\n\n• Every Jewish home requires kosher mezuzot on all appropriate doorways\n• The mezuzah provides spiritual protection and blessings for the home and its inhabitants\n• It\'s crucial to use only certified kosher scrolls - many non-kosher ones exist in the market\n• Consult your local Chabad/Orthodox rabbi about which doorways need mezuzot and where to obtain kosher ones', link: { displayText: 'Learn more about mezuzot', url: 'https://www.chabad.org/library/article_cdo/aid/278476/jewish/Mezuzah.htm' } },
            { text: 'At least one prayer daily (typically morning)', explanation: 'While men are obligated in three daily prayers, women are required to pray at least once per day. Many women choose to pray Shacharit (morning prayers). Some are lenient and offer a simple prayer comprised of praise, thanks, and a request.' },
            { text: 'Cover hair in public (if married)', explanation: 'Married Jewish women cover their hair when in public as a sign of modesty (tzniut) and to preserve the special nature of marriage.\n\nThe manner of covering varies by community - some use wigs, others use scarves, hats, or a combination.\n\nThis practice is based on biblical and rabbinic sources and is considered a fundamental aspect of Jewish law for married women.' },
            { text: 'Modesty (Tznius)', explanation: 'Modesty in Judaism encompasses both dress and behavior:\n\n• Wearing clothing that covers the body appropriately\n• Speaking and acting in a way that doesn\'t draw unwanted attention\n• Conducting ourselves in a way that reflects Jewish values\n\nThe goal is to emphasize our inner spiritual beauty and dignity as Jewish women. Different communities have varying standards - consult with a rabbi for guidance on what\'s appropriate for you.' },
            { text: 'Blessings before food', explanation: 'Before eating or drinking, we acknowledge G-d as the source of all sustenance. Different foods have specific blessings, helping us maintain constant awareness of G-d\'s providence.' },
            { text: 'Blessings after food', explanation: 'After eating, we express gratitude to G-d. After bread, we recite Birkat Hamazon (Grace After Meals). Other foods require shorter blessings, each thanking G-d for specific types of nourishment.' },
            { text: 'Asher Yatzar after using bathroom', explanation: 'This blessing acknowledges the wonder of our body\'s functioning and thanks G-d for maintaining our health. It reminds us that even basic bodily functions are miraculous gifts worthy of gratitude. Check your siddur for the proper text.' },
            { text: 'Keep Kosher', explanation: 'Keeping kosher involves following Jewish dietary laws:\n\n• Eating only kosher animals (e.g., no pork or shellfish)\n• Using only kosher-certified products\n• Separating meat and dairy completely\n• Using separate dishes, utensils, and appliances for meat and dairy\n• Waiting the required time between eating meat and dairy\n• Using only kosher wine and grape products\n• Special rules for Passover\n\nThese laws elevate eating into a spiritual act and help maintain Jewish identity. Please consult with a rabbi for guidance on implementing kosher practices in your home.' },
            { text: 'Family Purity Laws (if married)', explanation: 'Family purity laws (Taharat HaMishpacha) are central to Jewish married life:\n\n• Observing the laws of niddah (separation during menstruation)\n• Immersing in a mikvah at the appropriate time\n• Understanding the calendar calculations\n\nThese laws are considered one of the three primary mitzvot for Jewish women. They bring holiness and blessing to marriage. Please learn these laws from a qualified instructor before marriage.' },
            { text: 'Prepare for and observe Shabbat and Festivals', explanation: 'Shabbat and Jewish Festivals are sacred times that elevate us spiritually:\n\n• Light candles before sunset to welcome these holy days\n• Prepare food and our home in advance\n• Refrain from work activities (melacha) such as using electronics, driving, handling money etc.\n• Enjoy festive meals with family and community\n• Focus on prayer, Torah study, and spiritual growth\n\nProper observance of these days can bring our souls unique feelings of holiness and closeness with G-d that are unattainable during regular days. These elevated spiritual states can be experienced through proper observance of the laws.' },
            { text: 'Torah Study', explanation: 'While women\'s Torah study obligations differ from men\'s, it is important and meritorious for women to learn about the mitzvot in which they are obligated, such as:\n\n• Laws of Shabbat and Festivals\n• Kosher dietary laws\n• Laws of separating challah from dough\n• Family purity laws (for married women)\n• Laws of modest dress and conduct\n• Laws of prayer and blessings\n\nLearning these laws helps women fulfill mitzvot properly. The study should be approached in a pleasant and inspiring manner.\n\nMany wonderful resources are available specifically for women\'s Torah study, and classes are often offered by local rebbetzins and women teachers.' }
        ]);

        femaleContent.appendChild(femaleMitzvotSection);

        // Add sections in the correct order at the bottom for female content
        femaleContent.appendChild(specialMitzvotSection.cloneNode(true));
        femaleContent.appendChild(siddurimSection.cloneNode(true));
        femaleContent.appendChild(warningSection.cloneNode(true));
    }

    createSection(title, items) {
        const section = document.createElement('div');
        section.className = 'checklist-section';
        section.innerHTML = `<h3>${title}</h3>`;

        items.forEach(item => {
            const itemContainer = document.createElement('div');
            itemContainer.className = 'checklist-item';

            const itemContent = document.createElement('div');
            itemContent.className = 'item-content';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'item-checkbox';
            checkbox.dataset.text = item.text;
            checkbox.checked = this.storage.getDailyChecklist()?.items?.[item.text] || false;
            
            checkbox.addEventListener('change', () => {
                console.log('Checkbox changed:', { text: item.text, checked: checkbox.checked });
                this.handleDailyChecklistChange(item.text, checkbox.checked);
            });
            
            const textContainer = document.createElement('div');
            textContainer.className = 'item-text-container';
            textContainer.innerHTML = `<span class="item-text">${item.text}</span>`;
            
            const infoButton = document.createElement('button');
            infoButton.className = 'info-button';
            infoButton.innerHTML = 'i';
            infoButton.onclick = (e) => {
                e.stopPropagation();
                
                const dialog = document.createElement('div');
                dialog.className = 'dialog info-dialog';
                dialog.innerHTML = `
                    <div class="dialog-content">
                        <div class="dialog-header">
                            <h3 style="text-align: center; width: 100%;">${item.text}</h3>
                            <button class="close-button">×</button>
                        </div>
                        <div class="dialog-body">
                            <p class="item-explanation">${item.explanation}</p>
                            ${item.link ? `
                                <a href="${item.link.url}" target="_blank" class="dialog-link">
                                    ${item.link.displayText}
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
                
                document.body.appendChild(dialog);
                
                dialog.addEventListener('click', (e) => {
                    if (e.target === dialog) {
                        dialog.classList.add('closing');
                        setTimeout(() => dialog.remove(), 300);
                    }
                });
                
                dialog.querySelector('.close-button').onclick = () => {
                    dialog.classList.add('closing');
                    setTimeout(() => dialog.remove(), 300);
                };
            };
            
            itemContent.appendChild(checkbox);
            itemContent.appendChild(textContainer);
            itemContent.appendChild(infoButton);
            
            itemContainer.appendChild(itemContent);
            section.appendChild(itemContainer);
        });

        return section;
    }

    initializeMitzvahButton(button) {
        if (!button) {
            console.error('Button not provided to initializeMitzvahButton');
            return;
        }

        // Add click animation
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        // Enable the button
        button.disabled = false;
    }

    async playRewardVideo(videoNumber) {
        if (this.isLowBandwidth) {
            // Show a lightweight celebration instead of video
            return this.showLightweightCelebration(videoNumber);
        }
        
        console.log('playRewardVideo called with videoNumber:', videoNumber);
        return new Promise((resolve, reject) => {
            const dialog = document.createElement('div');
            dialog.className = 'dialog video-dialog';
            const videoPath = `assets/mitzmodenew${videoNumber}.mp4`;
            console.log('Attempting to play video from path:', videoPath);
            
            // Create stars with individual spans for animation
            const stars = Array(videoNumber).fill('✡')
                .map((star, i) => `<span style="animation-delay: ${i * 0.1}s">${star}</span>`)
                .join('');
            
            dialog.innerHTML = `
                <div class="dialog-content">
                    <video id="rewardVideo" autoplay>
                        <source src="${videoPath}" type="video/mp4">
                    </video>
                    <div class="level-up-overlay">
                        <div class="level-up-card">
                            <div class="star-burst"></div>
                            <h2>Level Up!</h2>
                            <div class="level-info">
                                <div class="level-title">${this.getLevelInfo(videoNumber).name}</div>
                                <div class="stars">${stars}</div>
                            </div>
                        </div>
                    </div>
                    <button class="skip-button">Skip</button>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            const video = dialog.querySelector('video');
            
            video.onerror = (e) => {
                console.error('Video error:', {
                    error: e.target.error,
                    currentSrc: video.currentSrc,
                    networkState: video.networkState,
                    readyState: video.readyState
                });
                reject(new Error('Failed to load video'));
            };

            video.onloadeddata = () => {
                console.log('Video loaded successfully');
                // Show level-up card after a short delay
                setTimeout(() => {
                    const overlay = dialog.querySelector('.level-up-overlay');
                    overlay.classList.add('show');
                }, 1000);
            };
            
            video.onended = () => {
                console.log('Video playback ended naturally');
                dialog.classList.add('closing');
                setTimeout(() => {
                    dialog.remove();
                    resolve();
                }, 300);
            };

            const skipButton = dialog.querySelector('.skip-button');
            skipButton.onclick = () => {
                console.log('Video skipped by user');
                video.pause();
                dialog.classList.add('closing');
                setTimeout(() => {
                    dialog.remove();
                    resolve();
                }, 300);
            };
        });
    }

    showLightweightCelebration(levelNumber) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'dialog celebration-dialog' + (this.isMobile ? ' mobile' : '');
            const levelInfo = this.getLevelInfo(levelNumber);
            
            dialog.innerHTML = `
                <div class="dialog-content">
                    <div class="celebration-content">
                        <div class="star-burst"></div>
                        <h2>Level Up!</h2>
                        <div class="level-info">
                            <div class="level-title">${levelInfo.name}</div>
                            <div class="stars">${'✡'.repeat(levelNumber)}</div>
                        </div>
                        <button class="close-button">Continue</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(dialog);
            
            setTimeout(() => {
                dialog.querySelector('.celebration-content').classList.add('show');
            }, 100);
            
            dialog.querySelector('.close-button').onclick = () => {
                dialog.classList.add('closing');
                setTimeout(() => {
                    dialog.remove();
                    resolve();
                }, 300);
            };
        });
    }

    showLevelUpDialog(level) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog level-up-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <button class="close-button">×</button>
                <h2 class="level-up-title">Level Up!</h2>
                <div class="level-up-animation">
                    <div class="star-burst"></div>
                    <div class="confetti"></div>
                </div>
                <p class="level-up-text">Congratulations! You've reached the level of:</p>
                <h3 class="level-name">${level.title}</h3>
                <p class="level-up-message">Keep up the amazing work!</p>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Add animation classes after a short delay to trigger animations
        setTimeout(() => {
            dialog.querySelector('.level-up-animation').classList.add('animate');
            dialog.querySelector('.level-name').classList.add('animate');
        }, 100);
        
        // Close on button click
        dialog.querySelector('.close-button').onclick = () => {
            dialog.classList.add('closing');
            setTimeout(() => dialog.remove(), 300);
        };

        // Close on background click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.classList.add('closing');
                setTimeout(() => dialog.remove(), 300);
            }
        });
    }

    checkTzaddikStatus() {
        // Count both daily checklist and completed mitzvot
        const checklist = this.storage.getDailyChecklist();
        const dailyCount = Object.values(checklist.items || {}).filter(Boolean).length;
        const completedMitzvot = this.storage.getCompletedMitzvot().length;
        const totalCount = dailyCount + completedMitzvot;
        
        console.log('Checking Tzaddik status:', {
            dailyCount,
            completedMitzvot,
            totalCount
        });

        const levels = [
            { threshold: 1, name: "Beginner" },
            { threshold: 10, name: "Ba'al Teshuva" },
            { threshold: 50, name: "Master Cholent Chef" },
            { threshold: 100, name: "Aspiring Kiddush Maker" },
            { threshold: 200, name: "Assistant Gabbai" },
            { threshold: 300, name: "Guy who hands out candy at shul" },
            { threshold: 400, name: "Western Wall Reveler" },
            { threshold: 500, name: "Sofer" },
            { threshold: 600, name: "Tzaddik" },
            { threshold: 700, name: "Living Sefer Torah" },
            { threshold: 800, name: "Eliyahu HaNavi" },
            { threshold: 900, name: "King David" },
            { threshold: 1000, name: "Moshiach!!!" }
        ];

        // Find current level
        const currentLevel = levels.filter(level => totalCount >= level.threshold).length;
        const lastAchievedLevel = this.storage.getLastAchievedLevel() || 0;

        console.log('Level check:', {
            currentLevel,
            lastAchievedLevel,
            hasLeveledUp: currentLevel > lastAchievedLevel
        });

        // If we've reached a new level
        if (currentLevel > lastAchievedLevel) {
            console.log('Level up detected! Preparing to show video...');
            this.storage.setLastAchievedLevel(currentLevel);
            
            // Show reward video and level up dialog for the new level
            if (currentLevel > 0 && currentLevel <= 13) {
                // Show level up dialog first
                const levelInfo = levels[currentLevel - 1];
                console.log('Showing level up dialog for:', levelInfo);
                DialogManager.showLevelUpDialog({ 
                    title: levelInfo.name,
                    nextLevel: this.getNextLevel(totalCount)
                });
                
                // Then play the reward video
                console.log('Attempting to play reward video for level:', currentLevel);
                this.playRewardVideo(currentLevel).then(() => {
                    console.log('Video playback completed successfully');
                    // Show notification after video ends
                    this.showNotification(`Mazel Tov! You've reached level ${currentLevel}: ${levelInfo.name}!`, 'success');
                }).catch(error => {
                    console.error('Error playing reward video:', error);
                });
            }
        }

        return totalCount;
    }

    showRewardVideo(videoNumber) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog video-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <video id="rewardVideo" playsinline autoplay>
                    <source src="assets/mitzmodenew${videoNumber}.mp4" type="video/mp4">
                </video>
                <button class="skip-button">Skip</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const video = dialog.querySelector('video');
        video.muted = false;
        
        // Add event listeners
        const closeVideo = () => {
            dialog.classList.add('closing');
            setTimeout(() => dialog.remove(), 300);
        };
        
        video.addEventListener('ended', closeVideo);
        dialog.querySelector('.skip-button').onclick = closeVideo;
        
        // Show level achievement notification
        const level = this.getLevelInfo(videoNumber);
        this.showNotification(`Mazel Tov! You've reached level ${videoNumber}: ${level.name}!`, 'success');
    }

    getLevelInfo(levelNumber) {
        const levels = [
            { name: "Beginner" },
            { name: "Ba'al Teshuva" },
            { name: "Master Cholent Chef" },
            { name: "Aspiring Kiddush Maker" },
            { name: "Assistant Gabbai" },
            { name: "Guy who hands out candy at shul" },
            { name: "Western Wall Reveler" },
            { name: "Sofer" },
            { name: "Tzaddik" },
            { name: "Living Sefer Torah" },
            { name: "Eliyahu HaNavi" },
            { name: "King David" },
            { name: "Moshiach!!!" }
        ];
        return levels[levelNumber - 1] || { name: "Unknown Level" };
    }
    
    shuffleMitzvotList() {
        for (let i = this.mitzvotList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.mitzvotList[i], this.mitzvotList[j]] = 
            [this.mitzvotList[j], this.mitzvotList[i]];
        }
    }
    
    getCurrentLevel(count) {
        if (!CONFIG || !CONFIG.LEVELS) {
            console.error('CONFIG.LEVELS is not defined');
            return 'Beginner'; // Default fallback
        }
        
        for (const [key, level] of Object.entries(CONFIG.LEVELS)) {
            if (count >= level.min && count <= level.max) {
                return level.title;
            }
        }
        return CONFIG.LEVELS.BEGINNER.title;
    }

    getNextLevel(currentCount) {
        const levels = [
            { threshold: 1, title: "Beginner" },
            { threshold: 10, title: "Ba'al Teshuva" },
            { threshold: 50, title: "Master Cholent Chef" },
            { threshold: 100, title: "Aspiring Kiddush Maker" },
            { threshold: 200, title: "Assistant Gabbai" },
            { threshold: 300, title: "Guy who hands out candy at shul" },
            { threshold: 400, title: "Western Wall Reveler" },
            { threshold: 500, title: "Sofer" },
            { threshold: 600, title: "Tzaddik" },
            { threshold: 700, title: "Living Sefer Torah" },
            { threshold: 800, title: "Eliyahu HaNavi" },
            { threshold: 900, title: "King David" },
            { threshold: 1000, title: "Moshiach!!!" }
        ];

        for (let i = 0; i < levels.length; i++) {
            if (currentCount < levels[i].threshold) {
                return {
                    title: levels[i].title,
                    remaining: levels[i].threshold - currentCount
                };
            }
        }
        return null;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <button class="close-button">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-hide after 5 seconds for non-error notifications
        if (type !== 'error') {
            setTimeout(() => {
                notification.classList.add('closing');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
        
        // Add close button handler
        notification.querySelector('.close-button').onclick = () => {
            notification.classList.add('closing');
            setTimeout(() => notification.remove(), 300);
        };
    }

    showAboutDialog() {
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
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.classList.add('closing');
                setTimeout(() => dialog.remove(), 300);
            }
        });
        
        dialog.querySelector('.close-button').onclick = () => {
            dialog.classList.add('closing');
            setTimeout(() => dialog.remove(), 300);
        };
    }

    initializeBackgroundVideo() {
        const video = document.getElementById('bgVideo');
        if (video) {
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            video.setAttribute('loop', '');
            video.muted = true;
            
            // Force autoplay for all browsers
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Auto-play was prevented
                    // Show a UI element to let the user manually start playback
                    console.log("Video autoplay was prevented:", error);
                    // Create a play button overlay if needed
                    this.createPlayButton();
                });
            }
        }
    }

    createPlayButton() {
        const playButton = document.createElement('button');
        playButton.className = 'video-play-button';
        playButton.innerHTML = '▶';
        document.body.appendChild(playButton);

        playButton.onclick = () => {
            const video = document.getElementById('bgVideo');
            if (video) {
                video.play();
                playButton.remove();
            }
        };
    }

    showWhatIsAMitzvahDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'dialog info-dialog whats-mitzvah';
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <h3>What's a Mitzvah?</h3>
                    <button class="close-button">×</button>
                </div>
                <div class="dialog-body">
                    <p>The word mitzvah (מצוה) literally means "commandment." In Judaism, mitzvot are the 613 commandments given by G-d through the Torah, and also some extra mitzvot which our rabbis, through Divine inspiration, added on.</p>

                    <p>While mitzvah means commandment, it also carries the deeper meaning of "connection." By performing a mitzvah, we fulfill G-d's will and connect with the Divine. It's like following instructions from a loved one; by doing so, you strengthen your bond with them.</p>

                    <p>G-d is constantly sending down pure Heavenly Light which sustains the world and everything in it. If you go against His will, it's like putting an umbrella between yourself and this Light. But by performing mitzvot you can connect with the Heavenly Goodness that is G-d Himself, and draw down more Light into the world.</p>
                </div>
                <div class="dialog-footer">
                    <button class="close-button primary-button">CLOSE</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.classList.add('closing');
                setTimeout(() => dialog.remove(), 300);
            }
        });
        
        const closeButtons = dialog.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.onclick = () => {
                dialog.classList.add('closing');
                setTimeout(() => dialog.remove(), 300);
            };
        });
    }

    addMitzvahToCompleted(mitzvah) {
        console.log('Adding mitzvah to completed:', mitzvah);
        const count = this.storage.addCompletedMitzvah(mitzvah);
        console.log('New completed count:', count);
        
        // Update the counter display
        const mitzvotCounter = document.getElementById('mitzvotCounter');
        if (mitzvotCounter) {
            const totalCount = this.storage.getCompletedMitzvot().length + 
                             Object.values(this.storage.getDailyChecklist().items || {}).filter(Boolean).length;
            mitzvotCounter.textContent = totalCount.toString();
        }
        
        this.checkTzaddikStatus();
        return count;
    }

    handleMitzvahButtonClick() {
        console.log('Mitzvah button clicked');
        
        // Fade out the instruction text
        const instructionText = document.getElementById('mitzvahInstruction');
        if (instructionText) {
            instructionText.classList.add('fade-out');
        }
        
        // Original functionality
        if (this.currentIndex >= this.mitzvotList.length) {
            console.log('Reached end of list, reshuffling...');
            this.shuffleMitzvotList();
            this.currentIndex = 0;
        }
        
        const mitzvah = this.mitzvotList[this.currentIndex];
        if (mitzvah) {
            console.log('Selected mitzvah:', mitzvah);
            this.currentIndex++; // Increment the index after selecting the mitzvah
            this.showMitzvahDialog(mitzvah);
        }
    }

    handleDailyChecklistChange(itemText, isChecked) {
        console.log('Daily checklist item changed:', { itemText, isChecked });
        this.storage.updateDailyChecklist(itemText, isChecked);
        
        // Update the counter display
        const mitzvotCounter = document.getElementById('mitzvotCounter');
        if (mitzvotCounter) {
            const totalCount = this.storage.getCompletedMitzvot().length + 
                             Object.values(this.storage.getDailyChecklist().items || {}).filter(Boolean).length;
            mitzvotCounter.textContent = totalCount.toString();
        }
        
        // Check if all items in either gender's list are checked
        const maleContent = document.getElementById('maleContent');
        const femaleContent = document.getElementById('femaleContent');
        
        if (maleContent) {
            const maleCheckboxes = maleContent.querySelectorAll('.item-checkbox');
            const allMaleChecked = Array.from(maleCheckboxes).every(cb => cb.checked);
            
            if (allMaleChecked) {
                console.log('All male checklist items completed!');
                const dialog = document.createElement('div');
                dialog.className = 'dialog video-dialog';
                dialog.innerHTML = `
                    <div class="dialog-content">
                        <video id="rewardVideo" autoplay>
                            <source src="assets/tzaddik.mp4" type="video/mp4">
                        </video>
                        <button class="skip-button">Skip</button>
                    </div>
                `;
                
                document.body.appendChild(dialog);
                
                const video = dialog.querySelector('video');
                video.onended = () => {
                    dialog.classList.add('closing');
                    setTimeout(() => dialog.remove(), 300);
                };
                
                const skipButton = dialog.querySelector('.skip-button');
                skipButton.onclick = () => {
                    video.pause();
                    dialog.classList.add('closing');
                    setTimeout(() => dialog.remove(), 300);
                };
            }
        }
        
        if (femaleContent) {
            const femaleCheckboxes = femaleContent.querySelectorAll('.item-checkbox');
            const allFemaleChecked = Array.from(femaleCheckboxes).every(cb => cb.checked);
            
            if (allFemaleChecked) {
                console.log('All female checklist items completed!');
                const dialog = document.createElement('div');
                dialog.className = 'dialog video-dialog';
                dialog.innerHTML = `
                    <div class="dialog-content">
                        <video id="rewardVideo" autoplay>
                            <source src="assets/tzaddik.mp4" type="video/mp4">
                        </video>
                        <button class="skip-button">Skip</button>
                    </div>
                `;
                
                document.body.appendChild(dialog);
                
                const video = dialog.querySelector('video');
                video.onended = () => {
                    dialog.classList.add('closing');
                    setTimeout(() => dialog.remove(), 300);
                };
                
                const skipButton = dialog.querySelector('.skip-button');
                skipButton.onclick = () => {
                    video.pause();
                    dialog.classList.add('closing');
                    setTimeout(() => dialog.remove(), 300);
                };
            }
        }
        
        this.checkTzaddikStatus();
    }

    showMitzvahDialog(mitzvah) {
        const dialog = document.createElement('div');
        dialog.className = 'dialog mitzvah-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <button class="close-button">×</button>
                <div class="dialog-header">
                    <h3>Mitzvah Opportunity</h3>
                </div>
                <div class="dialog-body">
                    <p class="mitzvah-text">${mitzvah.text}</p>
                    ${mitzvah.explanation ? `<p class="mitzvah-explanation">${mitzvah.explanation}</p>` : ''}
                    ${mitzvah.links && mitzvah.links.length > 0 ? `
                        <div class="dialog-links">
                            ${mitzvah.links.map(link => `
                                <a href="${link.url}" target="_blank" class="dialog-link">
                                    ${link.displayText}
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="dialog-footer">
                    <button class="accept-button primary-button">Accept</button>
                    <button class="next-button secondary-button">Next Mitzvah</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Handle dialog closing
        const closeDialog = () => {
            dialog.classList.add('closing');
            setTimeout(() => dialog.remove(), 300);
        };
        
        // Handle close button click
        const closeButton = dialog.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                closeDialog();
            });
        }
        
        // Handle accept button
        const acceptButton = dialog.querySelector('.accept-button');
        acceptButton.onclick = () => {
            this.addMitzvahToCompleted(mitzvah);
            // Update button appearance instead of closing
            acceptButton.textContent = 'Accepted!';
            acceptButton.classList.add('accepted');
            acceptButton.disabled = true;
        };
        
        // Handle next button
        dialog.querySelector('.next-button').onclick = () => {
            closeDialog();
            this.handleMitzvahButtonClick();
        };
        
        // Close on background click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                closeDialog();
            }
        });
    }

    async submitMitzvahSuggestion(mitzvahText, submitterName) {
        try {
            // Send suggestion to Formspree
            const response = await fetch('https://formspree.io/f/movjwkbe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': window.location.origin
                },
                body: JSON.stringify({
                    message: `New Mitzvah Suggestion`,
                    mitzvah: mitzvahText,
                    submitter: submitterName || 'Anonymous',
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                console.error('Failed to submit suggestion:', response.status);
                return false;
            }
            
            // Show success message
            this.showNotification('Thank you! Your mitzvah suggestion has been submitted.', 'success');
            return true;
        } catch (error) {
            console.error('Failed to submit mitzvah suggestion:', error);
            this.showNotification('Sorry, there was an error submitting your suggestion. Please try again.', 'error');
            return false;
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded - initializing MitzMode...');
    try {
    window.app = new MitzMode();
        console.log('MitzMode initialized successfully');
    } catch (error) {
        console.error('Failed to initialize MitzMode:', error);
    }
}); 

