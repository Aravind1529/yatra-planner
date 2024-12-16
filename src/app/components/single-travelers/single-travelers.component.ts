import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelerService } from '../../services/traveler.service';
import { Traveler } from '../../models/traveler.model';
import * as mysql from 'mysql';

@Component({
  selector: 'app-single-travelers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Single Travelers</h2>
      
      <div class="form-container">
        <input [(ngModel)]="traveler.name" placeholder="Name">
        <select [(ngModel)]="traveler.gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="number" [(ngModel)]="traveler.age" placeholder="Age">
        <input [(ngModel)]="traveler.contact" placeholder="Contact">
        <input type="number" [(ngModel)]="traveler.advancePaid" placeholder="Advance Paid">
        <button (click)="saveTraveler()">{{ isEditing ? 'Update' : 'Save' }}</button>
        <button *ngIf="isEditing" (click)="cancelEdit()">Cancel</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Contact</th>
            <th>Advance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of singleTravelers$ | async">
            <td>{{t.name}}</td>
            <td>{{t.gender}}</td>
            <td>{{t.age}}</td>
            <td>{{t.contact}}</td>
            <td>{{t.advancePaid}}</td>
            <td>
              <button (click)="editTraveler(t)">Edit</button>
              <button (click)="deleteTraveler(t)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .form-container { display: flex; gap: 10px; margin-bottom: 20px; }
    input, select { padding: 5px; }
    button { padding: 5px 10px; margin: 0 5px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  `]
})
export class SingleTravelersComponent {
  traveler: Traveler = this.getEmptyTraveler();
  singleTravelers$ = this.travelerService.getSingleTravelers();
  isEditing = false;
  connection: any;

  constructor(private travelerService: TravelerService) {}

  private getEmptyTraveler(): Traveler {
    return {
      name: '',
      age: 0,
      contact: '',
      advancePaid: 0,
      gender: 'male'
    };
  }

  saveTraveler() {
    this.travelerService.addSingleTraveler({ ...this.traveler });
    this.resetForm();
  }

  editTraveler(traveler: Traveler) {
    this.isEditing = true;
    this.traveler = { ...traveler };
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteTraveler(traveler: Traveler) {
    this.travelerService.deleteSingleTraveler(traveler);
  }

  private resetForm() {
    this.isEditing = false;
    this.traveler = this.getEmptyTraveler();
  }
}