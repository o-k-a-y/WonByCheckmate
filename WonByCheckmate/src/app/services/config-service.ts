import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  timeClassEmoji: Record<string, string> = {
    'bullet': '🚀',
    'blitz': '⚡',
    'rapid': '⏱️',
    'daily': '🗓️'
  };

  timeClasses: string[] = [
    'bullet',
    'blitz',
    'rapid',
    'daily'
  ];

  // Other rules include chess variants like bughouse that most likely won't be supported, but if are, would be added here
  rules: Record<string, string> = {
    chess: 'chess'
  };

  // TODO: Move to some const class/enum/etc
  won = 'won';
  lost = 'lost';
  draw = 'draw';

  wonLabels: string[] = [
    'wonByAbandonment',
    'wonByCheckmate',
    'wonByResignation',
    'wonByTimeout'
  ];

  lostLabels: string[] = [
    'lostByAbandonment',
    'lostByCheckmate',
    'lostByResignation',
    'lostByTimeout'
  ];

  drawLabels: string[] = [
    'drawBy50Move',
    'drawByAgreement',
    'drawByInsufficientMaterial',
    'drawByRepetition',
    'drawByStalemate',
    'drawByTimeoutVsInsufficientMaterial'
  ];

  convertTitle(timeClass: string, timeControl: string): string {
    return `${this.convertTimeClass(timeClass)} ${this.convertTimeControl(timeControl)}`;
  }

  // 1/86400 -> 1 days/move
  // 30 -> 30 seconds
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
    return this.timeClassEmoji[timeClass];
  }

  // Turn something like wonByResignation into Resignation for easier user readability
  convertLabel(label: string) {
    return label.split('By')[1];
  }

  // Return labels without the wonBy/lostBy/drawBy prefix 
  getLabels(outcome: string): string[] | null {
    switch (outcome) {
      case this.won:
        return this.wonLabels.map(label => {
          return label = this.convertLabel(label);
        })
      case this.lost:
        return this.lostLabels.map(label => {
          return label = this.convertLabel(label);
        })
      case this.draw:
        return this.drawLabels.map(label => {
          return label = this.convertLabel(label);
        })
      default:
        return null;
    }

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