import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { App } from '../main';
import { PairTravelersComponent } from './components/pair-travelers/pair-travelers.component';
import { SingleTravelersComponent } from './components/single-travelers/single-travelers.component';
import { GroupTravelersComponent } from './components/group-travelers/group-travelers.component';
import { TravelerService } from './services/traveler.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule,
    App,
    PairTravelersComponent,
    SingleTravelersComponent,
    GroupTravelersComponent
  ],
  providers: [TravelerService],
  bootstrap: []
})
export class AppModule { }