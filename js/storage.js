class StorageManager {
    constructor() {
        this.storage = window.localStorage;
        this.initializeStorage();
    }

    initializeStorage() {
        if (!this.storage.getItem('completedMitzvot')) {
            this.storage.setItem('completedMitzvot', JSON.stringify([]));
        }
        if (!this.storage.getItem('dailyChecklist')) {
            this.storage.setItem('dailyChecklist', JSON.stringify({ items: {}, lastUpdated: new Date().toDateString() }));
        }
        if (!this.storage.getItem('textSize')) {
            this.storage.setItem('textSize', CONFIG.DEFAULTS.TEXT_SIZE.toString());
        }
    }

    getCompletedMitzvot() {
        return JSON.parse(this.storage.getItem('completedMitzvot') || '[]');
    }

    addCompletedMitzvah(mitzvah) {
        const completed = this.getCompletedMitzvot();
        completed.push({
            id: mitzvah.id,
            text: mitzvah.text,
            timestamp: new Date().toISOString()
        });
        this.storage.setItem('completedMitzvot', JSON.stringify(completed));
        return completed.length;
    }

    getDailyChecklist() {
        let checklist = JSON.parse(this.storage.getItem('dailyChecklist') || '{}');
        const today = new Date().toDateString();
        
        if (checklist.lastUpdated !== today) {
            checklist = { items: {}, lastUpdated: today };
            this.storage.setItem('dailyChecklist', JSON.stringify(checklist));
        }
        
        return checklist;
    }

    updateDailyChecklist(itemText, checked) {
        const checklist = this.getDailyChecklist();
        checklist.items[itemText] = checked;
        this.storage.setItem('dailyChecklist', JSON.stringify(checklist));
    }

    clearDailyChecklist() {
        const today = new Date().toDateString();
        this.storage.setItem('dailyChecklist', JSON.stringify({ items: {}, lastUpdated: today }));
    }

    getTextSize() {
        return parseInt(this.storage.getItem('textSize') || CONFIG.DEFAULTS.TEXT_SIZE.toString());
    }

    setTextSize(size) {
        this.storage.setItem('textSize', size.toString());
    }

    hasShownTzaddikToday() {
        const lastShown = this.storage.getItem('lastTzaddikAlert');
        return lastShown === new Date().toDateString();
    }

    markTzaddikShown() {
        this.storage.setItem('lastTzaddikAlert', new Date().toDateString());
    }

    getLastAchievedLevel() {
        return parseInt(this.storage.getItem('lastAchievedLevel')) || 0;
    }

    setLastAchievedLevel(level) {
        this.storage.setItem('lastAchievedLevel', level.toString());
    }
} 