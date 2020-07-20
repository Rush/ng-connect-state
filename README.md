# 🦁 Connect state - Reactive components in Angular

> Automatically bind all asynchronous observables into a single synchronous sink. Extra features including loading indicators and simple API to reload your observables.

**NOTE: Ivy required**

## Installation

```bash
npm install ng-connect-state
# Or if you use yarn
yarn add ng-connect-state
```

```ts
import { ConnectState, connectState } from 'ng-connect-state';

@ConnectState()
@Component({ template: '{{ state.timer }} <button (click)="state.reload()"</button> Loading: {{ state.loading.timer }}' })
export class InboxComponent {
  ngOnDestroy() { }

  /**
   this exposes state.timer as a synchronous value!
  **/
  state = connectState(this, {
    timer: interval(1000),
  })
}
```

You can bind multiple observables and reload them individually as well:

```ts
@ConnectState()
@Component({})
export class HomeComponent {
  constructor(private httpClient: HttpClient) {}

  // We'll dispose it on destroy
  state = connectState(this, {
    users: httpClient.get('/users'),
    projects: httpClient.get('/projects'),
  })

  reloadUsers() {
    this.state.reload('users');
  }
  reloadProjects() {
    this.state.reload('projects');
  }
}
```

## Potential Pitfalls

- The order of decorators is important, make sure to put `@ConnectState()` before the `@Component()` decorator.
- When using [`overrideComponent`](https://angular.io/api/core/testing/TestBed#overrideComponent) in unit tests remember that it overrides metadata and component definition. Invoke `ConnectState()(YourComponent);` to reapply the decorator.

## Contributors ✨

This project's structuce is based on the amazing [@ngneat/until-destroy](https://github.com/ngneat/until-destroy) repository! Many thanks.

## License

MIT