import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild('drawer') drawer!: MatSidenav;

  // When the screen hits this size, the breakpoint observer is triggered
  maxWidth: string = '(max-width: 650px)';
  minWidth: string = '(min-width: 650px)';

  smallScreen$: Observable<boolean> = this.breakpointObserver.observe(this.maxWidth)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 650) {

      this.drawer.close();
    }
  }
}
