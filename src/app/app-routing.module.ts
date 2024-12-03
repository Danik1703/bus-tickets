import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { BusServiceComponent } from './bus-service/bus-service.component';

const routes: Routes = [
  { path: '', component: MainComponent },  
  { path: 'bus-service', component: BusServiceComponent },  
  { path: '**', redirectTo: '' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
