import { Exercise } from "./exercise.model";

export class TrainingService {
  private avaliableExercises: Exercise[]= [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
    { id: 'pushups', name: 'Push Ups', duration: 60, calories: 12 }
  ];

  private runningExercise: Exercise;

  getAvaliableExercises() {
    return this.avaliableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.avaliableExercises.find(ex => ex.id === selectedId);
  }
}