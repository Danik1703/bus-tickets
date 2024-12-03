import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; 
import { FormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { BusServiceComponent } from './bus-service/bus-service.component';
import { BusService } from './services/bus.service'; 

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    BusServiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    HttpClientModule
  ],
  providers: [BusService], 
  bootstrap: [AppComponent],
})
export class AppModule {}
