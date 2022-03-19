import { Component } from '@angular/core';
import { connectState } from 'src';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
})
@UntilDestroy()
export class CounterComponent {
  state = connectState(this as any, {
    counter: interval(100).pipe(finalize(() => {
        console.log('Finalized observable');
    })),
  });

  ngOnDestroy() {
    console.log('Destroyed counter');
  }
}
