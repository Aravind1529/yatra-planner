import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TravelerService } from '../../services/traveler.service';
import { PairTravelers, Traveler } from '../../models/traveler.model';

@Component({
  selector: 'app-pair-travelers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <h2><i class="fas fa-users"></i> Pair Travelers</h2>
        
        <div class="form-container">
          <div class="traveler-form">
            <h3><i class="fas fa-male"></i> Male Traveler</h3>
            <div class="form-group">
              <label class="required">Name</label>
              <input [(ngModel)]="maleTraveler.name" placeholder="Enter name" required>
            </div>
            <div class="form-group">
              <label class="required">Age</label>
              <input type="number" [(ngModel)]="maleTraveler.age" placeholder="Enter age" required>
            </div>
            <div class="form-group">
              <label class="required">Contact</label>
              <input [(ngModel)]="maleTraveler.contact" placeholder="Enter contact" required>
            </div>
            <div class="form-group">
              <label class="required">Advance Paid</label>
              <input type="number" [(ngModel)]="maleTraveler.advancePaid" placeholder="Enter advance amount" required>
            </div>
          </div>

          <div class="traveler-form">
            <h3><i class="fas fa-female"></i> Female Traveler</h3>
            <div class="form-group">
              <label class="required">Name</label>
              <input [(ngModel)]="femaleTraveler.name" placeholder="Enter name" required>
            </div>
            <div class="form-group">
              <label class="required">Age</label>
              <input type="number" [(ngModel)]="femaleTraveler.age" placeholder="Enter age" required>
            </div>
            <div class="form-group">
              <label class="required">Contact</label>
              <input [(ngModel)]="femaleTraveler.contact" placeholder="Enter contact" required>
            </div>
            <div class="form-group">
              <label class="required">Advance Paid</label>
              <input type="number" [(ngModel)]="femaleTraveler.advancePaid" placeholder="Enter advance amount" required>
            </div>
          </div>
        </div>

        <div class="button-group">
          <button class="btn-primary" (click)="savePair()" [disabled]="!isFormValid()">
            <i class="fas" [class.fa-save]="!isEditing" [class.fa-edit]="isEditing"></i>
            {{ isEditing ? 'Update' : 'Save' }} Pair
          </button>
          <button *ngIf="isEditing" class="btn-secondary" (click)="cancelEdit()">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Contact</th>
              <th>Advance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let pair of pairTravelers$ | async">
              <tr>
                <td>{{pair.male.name}}</td>
                <td>{{pair.male.age}}</td>
                <td>{{pair.male.contact}}</td>
                <td>₹{{pair.male.advancePaid}}</td>
                <td rowspan="2" class="action-cell">
                  <div class="action-buttons">
                    <button class="btn-edit" (click)="editPair(pair)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" (click)="deletePair(pair)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr class="female-row">
                <td>{{pair.female.name}}</td>
                <td>{{pair.female.age}}</td>
                <td>{{pair.female.contact}}</td>
                <td>₹{{pair.female.advancePaid}}</td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .form-container { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 20px; 
      margin-bottom: 20px; 
    }
    .traveler-form { 
      background: #f8f9fa; 
      padding: 20px; 
      border-radius: 8px; 
    }
    .form-group { margin-bottom: 15px; }
    .button-group { 
      display: flex; 
      gap: 10px; 
      justify-content: flex-end; 
      margin-top: 20px; 
    }
    .action-cell { 
      vertical-align: middle; 
      text-align: center; 
    }
    .female-row { background-color: #fff5f5; }
    .btn-edit { background-color: var(--secondary-color); }
    .btn-delete { background-color: #ff4757; }
    .action-buttons { 
      display: flex; 
      gap: 8px; 
      justify-content: center; 
    }
  `]
})
export class PairTravelersComponent implements OnInit {
  maleTraveler: Traveler = this.getEmptyTraveler('male');
  femaleTraveler: Traveler = this.getEmptyTraveler('female');
  pairTravelers$ = this.travelerService.getPairTravelers();
  isEditing = false;

  constructor(private travelerService: TravelerService) {}

  ngOnInit() {}

  private getEmptyTraveler(gender: 'male' | 'female'): Traveler {
    return {
      name: '',
      age: 0,
      contact: '',
      advancePaid: 0,
      gender
    };
  }

  isFormValid(): string | boolean {
    return this.maleTraveler.name && 
           this.maleTraveler.age > 0 && 
           this.maleTraveler.contact && 
           this.maleTraveler.advancePaid >= 0 &&
           this.femaleTraveler.name && 
           this.femaleTraveler.age > 0 && 
           this.femaleTraveler.contact && 
           this.femaleTraveler.advancePaid >= 0;
  }

  savePair() {
    if (!this.isFormValid()) return;
    
    this.travelerService.addPairTravelers({
      male: { ...this.maleTraveler },
      female: { ...this.femaleTraveler }
    });
    this.resetForm();
  }

  editPair(pair: PairTravelers) {
    this.isEditing = true;
    this.maleTraveler = { ...pair.male };
    this.femaleTraveler = { ...pair.female };
  }

  cancelEdit() {
    this.resetForm();
  }

  deletePair(pair: PairTravelers) {
    if (confirm('Are you sure you want to delete this pair?')) {
      this.travelerService.deletePairTravelers(pair);
    }
  }

  private resetForm() {
    this.isEditing = false;
    this.maleTraveler = this.getEmptyTraveler('male');
    this.femaleTraveler = this.getEmptyTraveler('female');
  }
}