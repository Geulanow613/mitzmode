const CONFIG = {
    // Level thresholds and titles
    LEVELS: {
        BEGINNER: { min: 0, max: 9, title: "Beginner" },
        BAAL_TESHUVA: { min: 10, max: 49, title: "Ba'al Teshuva" },
        MASTER_CHOLENT: { min: 50, max: 99, title: "Master Cholent Chef" },
        KIDDUSH_MAKER: { min: 100, max: 199, title: "Aspiring Kiddush Maker" },
        ASSISTANT_GABBAI: { min: 200, max: 299, title: "Assistant Gabbai" },
        CANDY_MAN: { min: 300, max: 399, title: "Guy who hands out candy at shul" },
        KOTEL_REVELER: { min: 400, max: 499, title: "Western Wall Reveler" },
        SOFER: { min: 500, max: 599, title: "Sofer" },
        TZADDIK: { min: 600, max: 699, title: "Tzaddik" },
        SEFER_TORAH: { min: 700, max: 799, title: "Living Sefer Torah" },
        ELIYAHU: { min: 800, max: 899, title: "Eliyahu HaNavi" },
        KING_DAVID: { min: 900, max: 999, title: "King David" },
        MOSHIACH: { min: 1000, max: Infinity, title: "Moshiach!!!" }
    },

    // Storage keys
    STORAGE: {
        COMPLETED_MITZVOT: 'completed_mitzvot',
        TEXT_SIZE: 'text_size',
        DAILY_CHECKLIST: 'daily_checklist'
    },

    // API endpoints and repositories
    API: {
        MITZVOT_LIST: 'https://api.github.com/repos/Geulanow613/mitzcloud/contents/mitzvotcloud.json',
        LOCAL_MITZVOT: 'data/mitzvotlistfull.json',
        SUGGESTIONS_REPO: 'Geulanow613/mitzvah-suggestions'
    },

    // Default values
    DEFAULTS: {
        TEXT_SIZE: 16,
        MIN_TEXT_SIZE: 12,
        MAX_TEXT_SIZE: 24
    },

    // Animation settings
    ANIMATIONS: {
        SPARKLE_COUNT: 12,
        SPARKLE_DURATION: 1000,
        LEVEL_UP_DURATION: 3000
    }
}; 