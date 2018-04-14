import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';

import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private avaliableExercises: Exercise[] = [];
  private runningExercise: Exercise;

  constructor(private db: AngularFirestore) {}

  fetchAvaliableExercises() {
    this.db
      .collection('avaliableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          }
        })
      })
      .subscribe((exercises: Exercise[]) => {
        console.log(exercises);
        this.avaliableExercises = exercises;
        this.exercisesChanged.next([...this.avaliableExercises]);
      });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.avaliableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({ 
      ...this.runningExercise, 
      date: new Date(), 
      state: 'completed' 
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({ 
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(), 
      state: 'cancelled' 
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise }
  }

  fetchCompletedOrCancelledExercises() {
    this.db.
      collection('finishedExercises').
      valueChanges().
      subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}