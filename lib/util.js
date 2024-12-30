export const timeMeasurements = [
    ["decade", 1000 * 60 * 60 * 24 * 3650],
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 365 / 12],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000]
];

export function pluralize(x, n) {
    return n + " " + (n === 1 ? x : (x + "s"));
}

/**
 * Verbal absolute difference in times
 * @param {Date} a First date
 * @param {Date} b Second date
 * @param {number} limit The limit of how in depth this goes
 * @returns {string}
 */
export function verbalTimeDifference(a, b, limit = timeMeasurements.find(m => m[0] === "month")[1]) {
    let time = Math.abs(a.getTime() - b.getTime()),
        output = [];

    for (const [name, millis] of timeMeasurements) {
        if (time >= millis) {
            output.push(pluralize(name, time / millis | 0));
            time %= millis;
        }

        if (millis <= limit) {
            break;
        }
    }

    let outputString = output.join(", ");

    if (outputString.includes(",")) {
        outputString = outputString.replace(/,([^,]*)$/, " and$1");
    }

    return outputString;
}