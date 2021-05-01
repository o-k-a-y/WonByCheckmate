import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-configuration',
  templateUrl: './game-configuration.component.html',
  styleUrls: ['./game-configuration.component.scss']
})
export class GameConfigurationComponent implements OnInit {
  @Input() results: JSON;
  @Input() name: string;
  resultTypes;

  constructor() { }

  ngOnInit(): void {

    console.log(this.results);
    this.resultTypes = Object.keys(this.results);
    console.log(this.resultTypes);
    console.log(this.name);
  }

}
