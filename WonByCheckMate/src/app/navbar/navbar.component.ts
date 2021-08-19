import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
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
  // width: SimpleChange = new SimpleChange(undefined, undefined, true);
  maxWidth: number = 650;
  maxWidthPx: string = `(max-width: ${this.maxWidth}px)`;
  minWidthPx: string = `(min-width: ${this.maxWidth}px)`;

  smallScreen$: Observable<boolean> = this.breakpointObserver.observe(this.maxWidthPx)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  // Close the side navbar if the screen width becomes larger than width
  // A better solution may be possible because this can still attempt to "close" the side navbar even if it's not open
  // Closing it means to set MatDrawerToggleResult to 'close'
  @HostListener('window:resize', ['$event'])
  closeSideNavbar(event) {
    // This solution may actually be slower than leaving it alone
    // this.width.previousValue = this.width.currentValue;
    // this.width.currentValue = event.target.innerWidth;
    // if (this.width.currentValue > this.maxWidth && this.width.previousValue !== undefined && this.width.previousValue < this.maxWidth) {

    //   this.drawer.close();
    // }

    if (event.target.innerWidth > this.maxWidth) {
      this.drawer.close();
    }
  }
}