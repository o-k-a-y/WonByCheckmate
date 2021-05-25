import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { GameConfigurationComponent } from './game-configuration/game-configuration.component';
import { UserFormComponent } from './user-form/user-form.component';
import { TableComponent } from './tables/table/table.component';
import { TablesComponent } from './tables/tables.component';

@NgModule({
  declarations: [
    AppComponent,
    GameConfigurationComponent,
    UserFormComponent,
    TableComponent,
    TablesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
