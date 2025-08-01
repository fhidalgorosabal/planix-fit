import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  Exercise,
  ExerciseBase,
} from '../../pages/routine-details/routine-details-model';

@Component({
  selector: 'app-exercise-form',
  imports: [FormsModule, NgSelectModule],
  templateUrl: './exercise-form.html',
})
export class ExerciseForm implements OnInit {
  @Input() model!: Exercise;
  @Input() isEdit: boolean = false;
  @Input() exerciseBase: ExerciseBase[] = [];

  @Output() save = new EventEmitter<Exercise>();
  @Output() cancel = new EventEmitter<void>();

  exerciseBaseList: string[] = [];

  ngOnInit(): void {
    this.exerciseBaseList = this.exerciseBase.map((e) => e.name);
  }
}
