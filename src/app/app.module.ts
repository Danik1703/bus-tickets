import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';


import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';


import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { BusServiceComponent } from './bus-service/bus-service.component';
import { BusService } from './services/bus.service'; 

import { MefDevCardModule, MefDevSelectModule } from '@natec/mef-dev-ui-kit'; 
import { PlatformHelper } from '@natec/mef-dev-platform-connector';

import { environment } from 'src/environments/environment';



function init(http: HttpClient, translate: TranslateService) {
  return () => forkJoin([
    of({}),
    translate.use(localStorage.getItem('language') || 'en')
  ]);
}


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
    CommonModule, 
    BrowserAnimationsModule,
    MefDevCardModule,
    MefDevSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatButtonModule,
    NgxMaterialTimepickerModule,
    TranslateModule.forRoot()
  ],
  providers: [
    BusService,
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [HttpClient, TranslateService],
      multi: true,
    },
    {
      provide: APP_BASE_HREF,
      useFactory: PlatformHelper.getAppBasePath
    },
  ], 
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
