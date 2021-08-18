import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WonByCheckmate';

  constructor(private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      "checkmate-dark",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/checkmate-dark.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "checkmate-light",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/checkmate-light.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "king-dark",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/king-dark.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "king-light",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/king-light.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "knight-dark",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/knight-dark.svg")
    );
  }
}
