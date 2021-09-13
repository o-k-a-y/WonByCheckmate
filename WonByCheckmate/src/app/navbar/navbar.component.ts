import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  isDarkTheme: boolean = false;
  localStorageTheme: string = 'theme';
  light: string = 'light';
  dark: string = 'dark';

  // When the screen hits this size, the breakpoint observer is triggered
  maxWidth: number = 650;
  maxWidthPx: string = `(max-width: ${this.maxWidth}px)`;

  // Observable that returns true if the screen size breaks past a certain point (maxWidth)
  smallScreen$: Observable<boolean> = this.breakpointObserver.observe(this.maxWidthPx)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.isDarkTheme = localStorage.getItem(this.localStorageTheme) === this.dark ? true : false;
  }

  // Close the side navbar if the screen width becomes larger than width
  // A better solution may be possible because this can still attempt to "close" the side navbar even if it's not open
  // Closing it means to set MatDrawerToggleResult to 'close'
  @HostListener('window:resize', ['$event'])
  closeSideNavbar(event: any) {
    if (event.target.innerWidth > this.maxWidth) {
      this.drawer.close();
    }
  }

  storeThemeSelection() {
    localStorage.setItem(this.localStorageTheme, this.isDarkTheme ? this.dark : this.light);
  }
}
