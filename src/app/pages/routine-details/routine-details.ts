import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutineDetailsSerice } from './service';

@Component({
  selector: 'app-routine-details',
  imports: [],
  templateUrl: './routine-details.html',
  styleUrl: './routine-details.css',
})
export class RoutineDetails implements OnInit {
  private routineDetailsSerice = inject(RoutineDetailsSerice);
  private route = inject(ActivatedRoute);
  data: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const day = params.get('day') || '1';
      this.data = this.routineDetailsSerice.getRoutineDetails(day);
    });
  }
}
