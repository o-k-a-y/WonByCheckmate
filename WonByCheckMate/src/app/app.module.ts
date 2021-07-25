import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { GameConfigurationComponent } from './game-configuration/game-configuration.component';
import { UserFormComponent } from './user-form/user-form.component';
import { TableComponent } from './tables/table/table.component';
import { TablesComponent } from './tables/tables.component';
import { ChartsModule } from 'ng2-charts';
import { PieChartsComponent } from './pie-charts/pie-charts.component';
import { PieChartComponent } from './pie-charts/wld-pie-charts/pie-chart/pie-chart.component';
import { WldPieChartsComponent } from './pie-charts/wld-pie-charts/wld-pie-charts.component';
import { WldPieChartComponent } from './pie-charts/wld-pie-charts/wld-pie-chart/wld-pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    GameConfigurationComponent,
    UserFormComponent,
    TableComponent,
    TablesComponent,
    PieChartsComponent, 
    PieChartComponent, WldPieChartsComponent, WldPieChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
