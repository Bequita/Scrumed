import { Component, OnInit, Input, Output } from '@angular/core';
import { interval } from 'rxjs';
import { Guest } from 'src/api/models/guest';
import { EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, useAnimation } from '@angular/animations';

const secondsCounter = interval(1000);

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  animations: [
    trigger('changeTitleSize', [
      state('initial', style({
        fontSize: '{{initialpixels}}px'
      }), { params: { initialpixels: 50 } }),
      state('final', style({
        fontSize: '{{finalpixels}}px'
      }), { params: { finalpixels: 75 } }),
      transition('initial => final', animate('100ms')),
      transition('final => initial', animate('400ms'))
    ])
  ]
})
export class TimerComponent implements OnInit {

  hours: string;
  minutes: string;
  seconds: string;

  currentState = 'initial';

  @Input() activeUser: Guest;
  activeUserRemainingSeconds: number = 500;

  @Input()
  set activeTime(value: Date) {
    this.hours = value.getHours().toString();
    this.minutes = value.getMinutes().toString();
    this.seconds = value.getSeconds().toString();
  }

  @Output() nextUser: EventEmitter<any> = new EventEmitter();

  constructor() { }

  changeTitleSize() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
  }

  nextTurn() {
    this.activeUserRemainingSeconds = 500;
    this.nextUser.emit(null);
  }

  countdown() {
    --this.activeUserRemainingSeconds;
    if (this.activeUserRemainingSeconds === 0)
      this.nextTurn();

    var newSeconds = +this.seconds - 1;
    var newMinutes = +this.minutes;
    var newHour = +this.hours;

    if (newSeconds === 0) {
      newSeconds = 59;
      newMinutes = +this.minutes - 1;
      if (newMinutes === 0) {
        newMinutes = 59;
        newHour = +this.hours - 1;
      }
    }

    newHour < 10 ? (this.hours = "0" + String(newHour)) : (this.hours = String(newHour));
    (newMinutes !== undefined && newMinutes < 10) ? (this.minutes = "0" + String(newMinutes)) : (this.minutes = String(newMinutes));
    (newSeconds != undefined && newSeconds < 10) ? (this.seconds = "0" + String(newSeconds)) : (this.seconds = String(newSeconds));
  }

  ngOnInit() {
    secondsCounter.subscribe(() => this.countdown());
  }

}