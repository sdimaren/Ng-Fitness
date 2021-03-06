import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription} from 'rxjs';

import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private avaliableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription [] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvaliableExercises() {
    this.fbSubs.push(this.db
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
        this.avaliableExercises = exercises;
        this.exercisesChanged.next([...this.avaliableExercises]);
      }));
  }

  startExercise(selectedId: string) {
    this.db.doc('avaliableExercises/' + selectedId).update({lastSelected: new Date()});
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
    this.fbSubs.push(this.db.
      collection('finishedExercises').
      valueChanges().
      subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}