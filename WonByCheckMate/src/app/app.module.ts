import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingInterceptorService } from './loader/loader-interceptor.service';
import { LoaderComponent } from './loader/loader.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OpeningsComponent } from './openings/openings.component';
import { PieChartsComponent } from './pie-charts/pie-charts.component';
import { TimeClassPieChartsComponent } from './pie-charts/time-class-pie-charts/time-class-pie-charts.component';
import { PieChartComponent } from './pie-charts/time-class-pie-charts/wld-pie-charts/pie-chart/pie-chart.component';
import { WldPieChartComponent } from './pie-charts/time-class-pie-charts/wld-pie-charts/wld-pie-chart/wld-pie-chart.component';
import { WldPieChartsComponent } from './pie-charts/time-class-pie-charts/wld-pie-charts/wld-pie-charts.component';
import { KeysPipe } from './pipes/keys.pipe';
import { ResultsComponent } from './results/results.component';
import { StatsGraphsComponent } from './stats-graphs/stats-graphs.component';
import { TableComponent } from './tables/table/table.component';
import { TablesComponent } from './tables/tables.component';
import { TimeClassTablesComponent } from './tables/time-class-tables/time-class-tables.component';
import { CheckboxComponent } from './user-form/checkbox/checkbox.component';
import { UserFormComponent } from './user-form/user-form.component';



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
    StatsGraphsComponent,
    LoaderComponent,
    NavbarComponent,
    OpeningsComponent,
    ResultsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule, // TODO: split material modules into a separate module to import here
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }