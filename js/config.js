const CONFIG = {
    // Level thresholds and titles (must stay in sync with Android/iOS)
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
        MOSHIACH: { min: 1000, max: 1799, title: "Moshiach!!!" },
        MITZ_MODE: { min: 1800, max: Infinity, title: "Mitz Mode!" }
    },

    // Reward / milestone routing — mirrors Android MitzModeViewModel.
    REWARDS: {
        /** Counts that trigger a full-screen reward clip. */
        MILESTONE_COUNTS: [1, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1800],
        /** Sentinel id used in place of a numeric mitzmodenew{N}.mp4 — maps to finalreward.mp4 with audio. */
        FINAL_REWARD_VIDEO_ID: 100,
        /** Asset path (relative to index.html) for the 1800+ Mitz Mode! tier clip. */
        FINAL_REWARD_ASSET: 'assets/finalreward.mp4',
        /** Asset prefix for milestone 1–13 clips (mitzmodenew1.mp4 … mitzmodenew13.mp4). */
        MILESTONE_ASSET_PREFIX: 'assets/mitzmodenew'
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
        LEVEL_UP_DURATION: 3000,
        ACCEPT_FLASH_DURATION: 1100
    }
};
