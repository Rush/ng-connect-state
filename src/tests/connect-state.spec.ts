import {
  ɵComponentDef as ComponentDef,
  ɵɵdefineComponent as defineComponent
} from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { stringify } from 'querystring';
import { defer, Observable, Subject } from 'rxjs';
import { ConnectState, connectState } from '..';

describe('connectState', () => {
  it('should automatically unsubscribe from observables on destroy', () => {
    const spy = jest.fn();

    @ConnectState()
    class TestComponent {
      static ɵcmp: ComponentDef<TestComponent> = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      });

      constructor() {
      }

      ngOnDestroy() { }

      state = connectState(this, {
        value: new Observable<string>(subscriber => {
          subscriber.next('foo');
          return {
            unsubscribe: spy,
          };
        }),
      });

      static ɵfac = () => new TestComponent();
    }

    const component = TestComponent.ɵfac();
    TestComponent.ɵcmp.onDestroy!.call(component);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('reload', () => {
  it('should reload all observables when called without parameters', () => {
      const spy = jest.fn(() => 'foo');
      const spy2 = jest.fn(() => 'foo');

      @ConnectState()
      class TestComponent {
        static ɵcmp: ComponentDef<TestComponent> = defineComponent({
          vars: 0,
          decls: 0,
          type: TestComponent,
          selectors: [[]],
          template: () => {}
        });

        constructor() {
        }

        ngOnDestroy() { }

        state = connectState(this, {
          value: defer(spy),
          value2: defer(spy2),
        });

        static ɵfac = () => new TestComponent();
      }

      const component = TestComponent.ɵfac();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      component.state.reload();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy2).toHaveBeenCalledTimes(2);
      TestComponent.ɵcmp.onDestroy!.call(component);
    });

    it('should reload specific obervable based on the key name', () => {
      const spy = jest.fn(() => 'foo');
      const spy2 = jest.fn(() => 'foo');

      @ConnectState()
      class TestComponent {
        static ɵcmp: ComponentDef<TestComponent> = defineComponent({
          vars: 0,
          decls: 0,
          type: TestComponent,
          selectors: [[]],
          template: () => {}
        });

        constructor() {
        }

        ngOnDestroy() { }

        state = connectState(this, {
          value: defer(spy),
          value2: defer(spy2),
        });

        static ɵfac = () => new TestComponent();
      }

      const component = TestComponent.ɵfac();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      component.state.reload('value');
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy2).toHaveBeenCalledTimes(1);
      TestComponent.ɵcmp.onDestroy!.call(component);
    });
  });

  it('should expose loading state', () => {
    const value = new Subject<string>();

    @ConnectState()
    class TestComponent {
      static ɵcmp: ComponentDef<TestComponent> = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      });

      constructor() {
      }

      ngOnDestroy() { }

      state = connectState(this, {
        value,
      });

      static ɵfac = () => new TestComponent();
    }

    const component = TestComponent.ɵfac();
    expect(component.state.loading.value).toEqual(true);
    value.next('foo');
    expect(component.state.loading.value).toEqual(false);

    TestComponent.ɵcmp.onDestroy!.call(component);
  });

  it('should apply symbol to decorated class definition', () => {
    @ConnectState()
    class TestComponent {
      static ɵcmp: ComponentDef<TestComponent> = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      });
    }

    const ownPropertySymbols = Object.getOwnPropertySymbols(TestComponent.ɵcmp);
    const decoratorAppliedSymbol = ownPropertySymbols.find(
      symbol => symbol.toString() === 'Symbol(__decoratorApplied)'
    );

    expect(decoratorAppliedSymbol).toBeDefined();
  });

  it('should throw if directive/component not decorated with ConnectState or UntilDestroy', () => {
    class TestComponent {
      static ɵcmp: ComponentDef<TestComponent> = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      });

      ngOnDestroy() { }

      state = connectState(this, {});

      static ɵfac = () => new TestComponent();
    }

    expect(() => TestComponent.ɵfac()).toThrow(/untilDestroyed operator cannot be used inside directives or components or providers that are not decorated with UntilDestroy decorator/);
  });
});
