import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PairTravelersComponent } from './app/components/pair-travelers/pair-travelers.component';
import { SingleTravelersComponent } from './app/components/single-travelers/single-travelers.component';
import { GroupTravelersComponent } from './app/components/group-travelers/group-travelers.component';
import { TravelerService } from './app/services/traveler.service';
import * as mysql from 'mysql';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: 'pairs', pathMatch: 'full' },
  { path: 'pairs', component: PairTravelersComponent },
  { path: 'singles', component: SingleTravelersComponent },
  { path: 'groups', component: GroupTravelersComponent }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <header>
        <h1 class="app-title">
          <i class="fas fa-om"></i>
          Sadguru Sri Gnanananda Bhagwan Satsang Yatra Planner
        </h1>
        <nav>
          <a routerLink="/pairs" routerLinkActive="active">
            <i class="fas fa-users"></i> Pair Travelers
          </a>
          <a routerLink="/singles" routerLinkActive="active">
            <i class="fas fa-user"></i> Single Travelers
          </a>
          <a routerLink="/groups" routerLinkActive="active">
            <i class="fas fa-user-friends"></i> Group Travelers
          </a>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  connection: any;
  constructor() {}
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    TravelerService
  ]
}).catch(err => console.error(err));