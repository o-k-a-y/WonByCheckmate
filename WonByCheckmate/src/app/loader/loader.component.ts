import { Component, OnInit } from '@angular/core';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  dark: string = 'dark';
  light: string = 'light';
  localStorageTheme: string = 'theme';

  constructor(public loaderService: LoaderService) { }

  ngOnInit(): void {
  }


  isDarkTheme(): boolean {
    return localStorage.getItem(this.localStorageTheme) === this.dark ? true : false;
  }

}
