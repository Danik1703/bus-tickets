import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; 
import { FormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { BusServiceComponent } from './bus-service/bus-service.component';
import { BusService } from './services/bus.service'; 
import { MefDevCardModule } from '@natec/mef-dev-ui-kit';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MefDevSelectModule } from '@natec/mef-dev-ui-kit';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';





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
    HttpClientModule,
    MefDevCardModule,
    MefDevSelectModule,
    BrowserAnimationsModule
  ],
  providers: [BusService], 
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {}
