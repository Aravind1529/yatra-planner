import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Traveler, PairTravelers } from '../models/traveler.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as mysql from 'mysql';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TravelerService {
  private pairTravelers = new BehaviorSubject<PairTravelers[]>([]);
  private singleTravelers = new BehaviorSubject<Traveler[]>([]);
  private groupTravelers = new BehaviorSubject<Traveler[]>([]);
  private currentId = 1;
  private connection: any;

  constructor() {}

  ngOnInit() {
  }
  
  private getNextId(): number {
    return this.currentId++;
  }

  getPairTravelers(): Observable<PairTravelers[]> {
    return this.pairTravelers.asObservable();
  }

  getSingleTravelers(): Observable<Traveler[]> {
    return this.singleTravelers.asObservable();
  }

  getGroupTravelers(): Observable<Traveler[]> {
    return this.groupTravelers.asObservable();
  }

  addPairTravelers(pair: PairTravelers) {
    const newPair = {
      male: { ...pair.male, id: pair.male.id || this.getNextId() },
      female: { ...pair.female, id: pair.female.id || this.getNextId() }
    };
    
    if (pair.male.id && pair.female.id) {
      // Edit existing pair
      const current = this.pairTravelers.value;
      const index = current.findIndex(p => 
        p.male.id === pair.male.id && p.female.id === pair.female.id
      );
      if (index !== -1) {
        const updated = [...current];
        updated[index] = newPair;
        this.pairTravelers.next(updated);
        return;
      }
    }
    
    // Add new pair
    this.pairTravelers.next([...this.pairTravelers.value, newPair]);
  }

  deletePairTravelers(pair: PairTravelers) {
    const current = this.pairTravelers.value;
    const updated = current.filter(p => 
      p.male.id !== pair.male.id && p.female.id !== pair.female.id
    );
    this.pairTravelers.next(updated);
  }

  addSingleTraveler(traveler: Traveler) {
    const newTraveler = { ...traveler, id: traveler.id || this.getNextId() };
    
    if (traveler.id) {
      // Edit existing traveler
      const current = this.singleTravelers.value;
      const index = current.findIndex(t => t.id === traveler.id);
      if (index !== -1) {
        const updated = [...current];
        updated[index] = newTraveler;
        this.singleTravelers.next(updated);
        return;
      }
    }
    
    // Add new traveler
    this.singleTravelers.next([...this.singleTravelers.value, newTraveler]);
  }

  deleteSingleTraveler(traveler: Traveler) {
    const current = this.singleTravelers.value;
    const updated = current.filter(t => t.id !== traveler.id);
    this.singleTravelers.next(updated);
  }

  addGroupTravelers(travelers: Traveler[]) {
    const newTravelers = travelers.map(t => ({
      ...t,
      id: t.id || this.getNextId()
    }));

    if (travelers.every(t => t.id)) {
      // Edit existing travelers
      const current = this.groupTravelers.value;
      const updated = current.filter(t => !travelers.find(nt => nt.id === t.id));
      this.groupTravelers.next([...updated, ...newTravelers]);
      return;
    }

    // Add new travelers
    this.groupTravelers.next([...this.groupTravelers.value, ...newTravelers]);
  }

  deleteGroupTraveler(traveler: Traveler) {
    const current = this.groupTravelers.value;
    const updated = current.filter(t => t.id !== traveler.id);
    this.groupTravelers.next(updated);
  }

  exportToExcel() {
    const wb = XLSX.utils.book_new();
    
    // Pair Travelers Sheet
    const pairData = this.pairTravelers.value.map(pair => ({
      'Male Name': pair.male.name,
      'Male Age': pair.male.age,
      'Male Contact': pair.male.contact,
      'Male Advance': pair.male.advancePaid,
      'Female Name': pair.female.name,
      'Female Age': pair.female.age,
      'Female Contact': pair.female.contact,
      'Female Advance': pair.female.advancePaid,
    }));
    const pairWs = XLSX.utils.json_to_sheet(pairData);
    XLSX.utils.book_append_sheet(wb, pairWs, 'Pair Travelers');

    // Single Male Travelers
    const singleMales = this.singleTravelers.value.filter(t => t.gender === 'male');
    const maleWs = XLSX.utils.json_to_sheet(singleMales);
    XLSX.utils.book_append_sheet(wb, maleWs, 'Single Males');

    // Single Female Travelers
    const singleFemales = this.singleTravelers.value.filter(t => t.gender === 'female');
    const femaleWs = XLSX.utils.json_to_sheet(singleFemales);
    XLSX.utils.book_append_sheet(wb, femaleWs, 'Single Females');

    // Group Travelers
    const groupWs = XLSX.utils.json_to_sheet(this.groupTravelers.value);
    XLSX.utils.book_append_sheet(wb, groupWs, 'Group Travelers');

    XLSX.writeFile(wb, 'pilgrim_travelers.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    
    // Pair Travelers
    doc.text('Pair Travelers', 14, 15);
    const pairData = this.pairTravelers.value.map(pair => [
      pair.male.name,
      pair.male.age.toString(),
      pair.male.contact,
      pair.male.advancePaid.toString(),
      pair.female.name,
      pair.female.age.toString(),
      pair.female.contact,
      pair.female.advancePaid.toString(),
    ]);
    autoTable(doc, {
      head: [['Male Name', 'Age', 'Contact', 'Advance', 'Female Name', 'Age', 'Contact', 'Advance']],
      body: pairData,
      startY: 20,
    });

    // Single Travelers
    doc.addPage();
    doc.text('Single Travelers', 14, 15);
    const singleData = this.singleTravelers.value.map(t => [
      t.name,
      t.gender,
      t.age.toString(),
      t.contact,
      t.advancePaid.toString(),
    ]);
    autoTable(doc, {
      head: [['Name', 'Gender', 'Age', 'Contact', 'Advance']],
      body: singleData,
      startY: 20,
    });

    // Group Travelers
    doc.addPage();
    doc.text('Group Travelers', 14, 15);
    const groupData = this.groupTravelers.value.map(t => [
      t.name,
      t.gender,
      t.age.toString(),
      t.contact,
      t.advancePaid.toString(),
    ]);
    autoTable(doc, {
      head: [['Name', 'Gender', 'Age', 'Contact', 'Advance']],
      body: groupData,
      startY: 20,
    });

    doc.save('pilgrim_travelers.pdf');
  }
}