import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CreatePromiseComponent } from './create-promise/create-promise.component';


@NgModule({
  declarations: [
    AppComponent,
    CreatePromiseComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
