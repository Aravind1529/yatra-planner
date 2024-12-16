import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelerService } from '../../services/traveler.service';
import { Traveler } from '../../models/traveler.model';

@Component({
  selector: 'app-group-travelers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Group Travelers</h2>
      
      <div class="travelers-list">
        <div *ngFor="let t of groupMembers; let i = index" class="traveler-form">
          <input [(ngModel)]="t.name" placeholder="Name">
          <select [(ngModel)]="t.gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="number" [(ngModel)]="t.age" placeholder="Age">
          <input [(ngModel)]="t.contact" placeholder="Contact">
          <input type="number" [(ngModel)]="t.advancePaid" placeholder="Advance Paid">
          <button (click)="removeMember(i)">Remove</button>
        </div>
      </div>

      <button (click)="addMember()">Add Member</button>
      <button (click)="saveGroup()">{{ isEditing ? 'Update Group' : 'Save Group' }}</button>
      <button *ngIf="isEditing" (click)="cancelEdit()">Cancel</button>

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
          <tr *ngFor="let t of groupTravelers$ | async">
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

      <div class="export-buttons">
        <button (click)="exportToExcel()">Export as Excel</button>
        <button (click)="exportToPDF()">Export as PDF</button>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .travelers-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .traveler-form { display: flex; gap: 10px; align-items: center; }
    input, select { padding: 5px; }
    button { padding: 5px 10px; margin: 0 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .export-buttons { display: flex; gap: 10px; margin-top: 20px; }
  `]
})
export class GroupTravelersComponent {
  groupMembers: Traveler[] = [this.getEmptyTraveler()];
  groupTravelers$ = this.travelerService.getGroupTravelers();
  isEditing = false;

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

  addMember() {
    this.groupMembers.push(this.getEmptyTraveler());
  }

  removeMember(index: number) {
    this.groupMembers.splice(index, 1);
    if (this.groupMembers.length === 0) {
      this.addMember();
    }
  }

  saveGroup() {
    this.travelerService.addGroupTravelers([...this.groupMembers]);
    this.resetForm();
  }

  editTraveler(traveler: Traveler) {
    this.isEditing = true;
    this.groupMembers = [{ ...traveler }];
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteTraveler(traveler: Traveler) {
    this.travelerService.deleteGroupTraveler(traveler);
  }

  private resetForm() {
    this.isEditing = false;
    this.groupMembers = [this.getEmptyTraveler()];
  }

  exportToExcel() {
    this.travelerService.exportToExcel();
  }

  exportToPDF() {
    this.travelerService.exportToPDF();
  }
}