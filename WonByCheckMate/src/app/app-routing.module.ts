import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpeningsComponent } from './openings/openings.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path: 'results', component: ResultsComponent },
  { path: 'openings', component: OpeningsComponent },
  { path: '**', component: ResultsComponent} // TODO: Add some 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }