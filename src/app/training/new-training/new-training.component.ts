import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from './../training.service';
import { Exercise } from '../exercise.model';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSubcription: Subscription;

  constructor(
    private trainingService: TrainingService,
  ) {}
  
  ngOnInit() {
    this.exerciseSubcription = this.trainingService.exercisesChanged.subscribe(
      exercises => this.exercises = exercises
    );
    this.trainingService.fetchAvaliableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exerciseSubcription.unsubscribe();
  }
}
