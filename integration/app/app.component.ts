import { Component } from '@angular/core';
import { connectState, ConnectState } from 'src';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@ConnectState()
export class AppComponent {
  constructor() {}

  state = connectState(this, {
    counter: interval(1000),
    counter2: interval(500),
    counter3: interval(250),
  });

  ngOnDestroy() {
  }
}
