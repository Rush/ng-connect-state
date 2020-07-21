# Connect state - Reactive components in Angular

> Automatically bind all asynchronous observables into a simple synchronous sink. Extra features including loading indicators and simple API to reload your observables.

![ng-connect-state](https://github.com/Rush/ng-connect-state/workflows/ng-connect-state/badge.svg)

**NOTE: Ivy required**

## Installation

```bash
npm install ng-connect-state @ngneat/until-destroy
# Or if you use yarn
yarn add ng-connect-state @ngneat/until-destroy
```

`@ngneat/until-destroy` is a peer dependency.

## Examples

```ts
import { ConnectState, connectState } from 'ng-connect-state';
import { interval } from 'rxjs';

@ConnectState()
@Component({ template: `
  {{ state.timer }}
  <button (click)="state.reload()"</button>
  Loading: {{ state.loading.timer }}
  `
})
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
  ngOnDestroy() { }

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
