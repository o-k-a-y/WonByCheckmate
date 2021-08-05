import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from './user-form/user-form.component';
import { ChartsModule } from 'ng2-charts';
import { PieChartsComponent } from './pie-charts/pie-charts.component';
import { PieChartComponent } from './pie-charts/time-class-pie-charts/wld-pie-charts/pie-chart/pie-chart.component';
import { WldPieChartsComponent } from './pie-charts/time-class-pie-charts/wld-pie-charts/wld-pie-charts.component';
import { WldPieChartComponent } from './pie-charts/time-class-pie-charts/wld-pie-charts/wld-pie-chart/wld-pie-chart.component';
import { TablesComponent } from './tables/tables.component';
import { TableComponent } from './tables/table/table.component';
import { KeysPipe } from './pipes/keys.pipe';
import { TimeClassTablesComponent } from './tables/time-class-tables/time-class-tables.component';
import { TimeClassPieChartsComponent } from './pie-charts/time-class-pie-charts/time-class-pie-charts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { CheckboxComponent } from './user-form/checkbox/checkbox.component';
import { StatsGraphsComponent } from './stats-graphs/stats-graphs.component';


@NgModule({
  declarations: [
    AppComponent,
    KeysPipe,
    UserFormComponent,
    TableComponent,
    TablesComponent,
    PieChartsComponent,
    PieChartComponent,
    WldPieChartsComponent,
    WldPieChartComponent,
    TimeClassTablesComponent,
    TimeClassPieChartsComponent,
    CheckboxComponent,
    StatsGraphsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatCheckboxModule, // TODO: split material modules into a separate module to import here
    MatCardModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }