export interface Traveler {
  id?: number;
  name: string;
  age: number;
  contact: string;
  advancePaid: number;
  gender: 'male' | 'female';
}

export interface PairTravelers {
  male: Traveler;
  female: Traveler;
}