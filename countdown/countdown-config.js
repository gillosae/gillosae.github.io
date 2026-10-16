// ============================================
// COUNTDOWN CONFIGURATION
// ============================================
// Events are listed in priority order.
// The first upcoming (non-passed) event becomes the primary countdown.
// The next 4 upcoming events are shown as secondaries.

const config = {
    // All event date/time values below are written in AoE (Anywhere on Earth = UTC-12).
    // The page converts them to each visitor's local timezone automatically.
    // (Change this offset if the times below are ever written in another zone,
    //  e.g. "+09:00" for KST.)
    timezone: "-12:00",
    events: [
        {
            name: "CVPR",
            date: "2026-11-16",
            time: "23:59:59",
            est: false
        },
        {
            name: "SIGIR",
            date: "2026-12-16",
            time: "23:59:59",
            est: false
        },
        {
            name: "ACL ARR",
            date: "2027-01-06",
            time: "23:59:59",
            est: false
        },
        {
            name: "ICML",
            date: "2027-01-15",
            time: "23:59:59",
            est: true
        },
        {
            name: "Interspeech",
            date: "2027-02-16",
            time: "23:59:59",
            est: false
        }
    ]
};
