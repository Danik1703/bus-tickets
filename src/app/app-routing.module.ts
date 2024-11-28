import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { DetailsComponent } from './components/details/details.component';

const routes: Routes = [
  { path: '', component: MainComponent }, 
  { path: 'search', component: SearchComponent }, 
  { path: 'results', component: ResultsComponent }, 
  { path: 'details/:id', component: DetailsComponent }, 
  { path: '**', redirectTo: '' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
