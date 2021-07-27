import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    timeClass: {} = {
        "bullet": "🚀",
        "blitz": "⚡",
        "rapid": "⏲️",
        "daily": "🗓️"
    }

    won = 'won';
    lost = 'lost';
    draw = 'draw';

    convertTimeControl(timeControl: string): string {
        // TODO: Use regex instead to convert
        // Is it a daily game such as 1/86400 (24 hours to make a move)
        if (timeControl.includes('/')) {
            const dailyTime = timeControl.split('/');
            if (dailyTime.length <= 1) {
                return "time is broken";
            }

            const secondsPerMove = parseInt(dailyTime[1]);
            const daysPerMove = secondsPerMove / (24 * 60 * 60);
            return `${daysPerMove} days/move`;

        }

        // Time is in seconds, but check for +x which signifies +x seconds added after making a move
        if (timeControl.includes('+')) {
            const time = timeControl.split('+');

            if (time.length <= 1) {
                return "+ time is broken";
            }

            const extraSeconds = time[1];
            const secondsPerMove = this.convertSecondsToTime(time[0]);

            return `${secondsPerMove} | ${extraSeconds}`;
        }

        return this.convertSecondsToTime(timeControl);
    }


    // Return emoji equivalent of the time class string
    convertTimeClass(timeClass: string): string {
        return this.timeClass[timeClass];
    }

    // Turn something like wonByResignation into Resignation for easier user readability
    convertLabel(label: string) {
        return label.split('By')[1];
    }

    private convertSecondsToTime(seconds: string): string {
        const secondsPerMove = parseInt(seconds);
        if (secondsPerMove < 60) {
            return `${secondsPerMove} seconds`;
        } else {
            const minutesPerMove = secondsPerMove / 60;
            return `${minutesPerMove} ${minutesPerMove === 1 ? "minute" : "minutes"}`;
        }
    }
}