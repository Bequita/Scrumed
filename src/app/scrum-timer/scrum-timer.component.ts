import { Component, OnInit, HostBinding } from '@angular/core';
import { GuestService } from 'src/api/services/guest.service';
import { Guest } from 'src/api/models/guest';
import { TimerService } from 'src/api/services/timer.service';
import { Router } from '@angular/router';
import { Scrum } from 'src/api/models/scrum';

@Component({
  selector: 'app-scrum-timer',
  templateUrl: './scrum-timer.component.html',
  styleUrls: ['./scrum-timer.component.scss']
})
export class ScrumTimerComponent implements OnInit {

  guestList: Guest[] = [];
  activeGuest: Guest;
  currentScrum: Scrum;
  remainingSeconds: string;

  constructor(
    private guestService: GuestService,
    private timerService: TimerService,
    private router: Router
  ) { }

  enableNextUser() {
    var currentTurn = this.activeGuest.turn + 1;
    this.activeGuest = this.guestList.find(g => g.turn === currentTurn);
    if (this.activeGuest === undefined)
      this.router.navigate(['/scrum-finished']);
  }

  ngOnInit() {
    this.timerService.getCurrentTime().subscribe(scrum => this.currentScrum = scrum);
    this.remainingSeconds = this.currentScrum.minutesPerGuest + 's';
    this.guestService.getGuests().subscribe(guests => {
      this.guestList = guests;
      this.activeGuest = this.guestList.find(g => g.isActive);
    });
  }
}