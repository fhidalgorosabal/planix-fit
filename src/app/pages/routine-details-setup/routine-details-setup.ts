import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoutineDetailsApi } from '../routine-details/routine-details-api';
import { DayApi } from '../../api/day/day-api';
import { IconComponent } from '../../components/icons/icons';
import { Exercise } from '../routine-details/routine-details-model';

@Component({
  imports: [RouterLink, IconComponent, FormsModule, NgSelectModule],
  templateUrl: './routine-details-setup.html',
})
export class RoutineDetailsSetup {
  private route = inject(ActivatedRoute);
  private routineDetailsApi = inject(RoutineDetailsApi);
  private dayApi = inject(DayApi);

  day = signal('1');
  exercises = computed(() =>
    this.routineDetailsApi.getExercisesByDay(this.day())
  );

  exercicesBase = computed(() =>
    this.routineDetailsApi.getCachedExercisesBase()
  );

  editingExercise = signal<Exercise | null>(null);
  showAddForm = signal(false);

  newExercise: Exercise = {
    id: '',
    name: '',
    reps: 10,
    sets: 3,
    unit: '',
    restTime: 60,
    restTimeSet: 120,
  };

  constructor() {
    effect(() => {
      this.route.paramMap.subscribe((params) => {
        const newDay = params.get('day') || '1';
        this.day.set(newDay);
        this.routineDetailsApi.loadDataIfNeeded();
      });
    });
  }

  dayDate = computed(() => {
    return this.dayApi.getDayName(Number(this.day()));
  });

  startEdit(exercise: Exercise): void {
    this.editingExercise.set({ ...exercise });
  }

  cancelEdit(): void {
    this.editingExercise.set(null);
  }

  saveExercise(): void {
    const exercise = this.editingExercise();
    if (!exercise) return;

    this.routineDetailsApi.updateExercise(this.day(), exercise);
    this.editingExercise.set(null);
  }

  deleteExercise(exerciseId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este ejercicio?')) {
      this.routineDetailsApi.deleteExercise(this.day(), exerciseId);
    }
  }

  showAddExerciseForm(): void {
    this.resetNewExercise();
    this.showAddForm.set(true);
  }

  hideAddExerciseForm(): void {
    this.showAddForm.set(false);
  }

  addExercise(): void {
    if (this.newExercise.name.trim() === '') {
      alert('El nombre del ejercicio es obligatorio');
      return;
    }

    this.routineDetailsApi.addExercise(this.day(), { ...this.newExercise });
    this.hideAddExerciseForm();
    this.resetNewExercise();
  }

  resetNewExercise(): void {
    this.newExercise = {
      id: '',
      name: '',
      reps: 10,
      sets: 3,
      unit: '',
      restTime: 60,
      restTimeSet: 120,
    };
  }
}
