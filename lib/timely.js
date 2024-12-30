import { verbalTimeDifference } from "./util.js";

class TimelyUpdate {
    static DYNAMIC = {
        SINCE: 0,
        UNTIL: 1
    };

    elementID = "";

    /** @type { { timestamp: Date, textContent: string}[] | null } */
    timeframes = null;

    /** @type { { timestamp: Date, type: number } | null } */
    dynamic = null;
}

/** @type {TimelyUpdate[]} */
const timelyUpdates = [{
    elementID: "college-status",
    timeframes: [{
        timestamp: new Date("2024-09-01T00:00:00Z"),
        textContent: "freshman"
    }, {
        timestamp: new Date("2025-09-01T00:00:00Z"),
        textContent: "sophomore"
    }, {
        timestamp: new Date("2026-09-01T00:00:00Z"),
        textContent: "junior"
    }, {
        timestamp: new Date("2027-09-01T00:00:00Z"),
        textContent: "senior"
    }, {
        timestamp: new Date("2028-09-01T00:00:00Z"),
        textContent: "graduate student"
    }]
}, {
    elementID: "coding-years",
    dynamic: {
        timestamp: new Date("2017-04-01T00:00:00Z"),
        type: TimelyUpdate.DYNAMIC.SINCE
    }
}];

export default function updateTimely() {
    const now = new Date();

    for (const timelyUpdate of timelyUpdates) {
        const element = document.getElementById(timelyUpdate.elementID);
        if (element === null) {
            console.warn(`Element with ID "${timelyUpdate.elementID}" not found`);
            continue;
        }

        if (timelyUpdate.timeframes?.length > 0) {
            let latestContent = timelyUpdate.timeframes[0].textContent;
            for (const timeframe of timelyUpdate.timeframes) {
                if (now >= timeframe.timestamp) {
                    latestContent = timeframe.textContent;
                }
            }

            element.textContent = latestContent;
            continue;
        }

        if (timelyUpdate.dynamic == null) {
            console.warn(`Timely Update for element with ID "${timelyUpdate.elementID}" has no purpose`);
            continue;
        }

        switch (timelyUpdate.dynamic.type) {
            case TimelyUpdate.DYNAMIC.SINCE:
                element.textContent = verbalTimeDifference(now, timelyUpdate.dynamic.timestamp);
                break;
        }
    }

    setTimeout(updateTimely, 3.6e6);
}