import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
  inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Exercise } from '../../pages/routine-details/routine-details-model';
import { SoundApi } from '../../api/sound/sound-api';
import { IconComponent } from '../icons/icons';

@Component({
  selector: 'app-exercise-item',
  standalone: true,
  imports: [NgClass, IconComponent],
  templateUrl: './exercise-item.html',
})
export class ExerciseItem implements OnInit {
  private soundApi = inject(SoundApi);

  @Input({ required: true }) exercise!: Exercise;
  @Input() isGlobalResting: boolean = false;
  @Input() isExpanded: boolean = false;
  @Output() exerciseCompleted = new EventEmitter<void>();
  @Output() toggleExpand = new EventEmitter<void>();

  currentSet = signal(1);
  isResting = signal(false);
  restTime = 0;
  countdown = signal(this.restTime);
  private intervalId: any;

  isCompleted = computed(() => this.currentSet() > this.exercise.sets);

  ngOnInit(): void {
    this.restTime = this.exercise?.rest_time || 60;
  }

  onToggle() {
    if (this.isGlobalResting) return;
    this.toggleExpand.emit();
  }

  completeSet() {
    if (this.isGlobalResting) return;

    if (this.currentSet() < this.exercise.sets) {
      this.isResting.set(true);
      this.countdown.set(this.restTime);
      this.startRestTimer();
    } else {
      this.currentSet.update((v) => v + 1);
    }

    if (this.currentSet() + 1 > this.exercise.sets) {
      this.exerciseCompleted.emit();
    }
  }

  private startRestTimer() {
    this.intervalId = setInterval(() => {
      this.countdown.update((n) => n - 1);
      if (this.countdown() <= 0) {
        clearInterval(this.intervalId);
        this.isResting.set(false);
        this.currentSet.update((n) => n + 1);
        this.soundApi.play('sounds/sound-1.mp3', 3);
      }
    }, 1000);
  }
}
