import { Component } from '@angular/core';
import { connectState } from 'src';
import { interval } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@UntilDestroy()
export class AppComponent {
  constructor() {}

  state = connectState(this as any, {
    counter: interval(1000),
    counter2: interval(500),
    counter3: interval(250),
  });

  showCounter = true;

  ngOnDestroy() {
  }
}
