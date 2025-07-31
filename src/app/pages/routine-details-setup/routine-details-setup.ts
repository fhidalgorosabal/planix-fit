import { Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutineDetailsApi } from '../routine-details/routine-details-api';
import { IconComponent } from '../../components/icons/icons';
import { Exercise } from '../routine-details/routine-details-model';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, DatePipe, IconComponent, FormsModule],
  templateUrl: './routine-details-setup.html',
})
export class RoutineDetailsSetup {
  private route = inject(ActivatedRoute);
  private routineDetailsApi = inject(RoutineDetailsApi);

  day = signal('1');
  exercises = computed(() =>
    this.routineDetailsApi.getExercisesByDay(this.day())
  );

  // Estado para el formulario de edición
  editingExercise = signal<Exercise | null>(null);
  showAddForm = signal(false);

  // Nuevo ejercicio
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
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      parseInt(this.day(), 10) - 1
    );
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
