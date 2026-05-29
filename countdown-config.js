// ============================================
// COUNTDOWN CONFIGURATION
// ============================================
// Events are listed in priority order.
// The first upcoming (non-passed) event becomes the primary countdown.
// The next 4 upcoming events are shown as secondaries.

const config = {
    events: [
        {
            name: "AAAI",
            date: "2026-07-22",
            time: "21:00:00",
            est: false
        },
        {
            name: "CHI",
            date: "2026-09-11",
            time: "21:00:00",
            est: false
        },
        {
            name: "ICASSP",
            date: "2026-09-17",
            time: "21:00:00",
            est: false
        },
        {
            name: "ICLR",
            date: "2026-09-25",
            time: "21:00:00",
            est: true
        },
        {
            name: "CVPR",
            date: "2026-11-14",
            time: "21:00:00",
            est: true
        }
    ]
};
