import {
  ɵComponentDef as ComponentDef,
  ɵɵdefineComponent as defineComponent
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { defer, Observable, Subject } from 'rxjs';
import { connectState } from '..';

describe('connectState', () => {
  it('should automatically unsubscribe from observables on destroy', () => {
    const spy = jest.fn();

    @UntilDestroy()
    class TestComponent {
      static ɵcmp = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      }) as ComponentDef<TestComponent>;

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
    component.ngOnDestroy();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe('reload', () => {
  it('should reload all observables when called without parameters', () => {
      const spy = jest.fn(() => 'foo');
      const spy2 = jest.fn(() => 'foo');

      @UntilDestroy()
      class TestComponent {
        static ɵcmp = defineComponent({
          vars: 0,
          decls: 0,
          type: TestComponent,
          selectors: [[]],
          template: () => {}
        }) as ComponentDef<TestComponent>;

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
      component.ngOnDestroy();
    });

    it('should reload specific obervable based on the key name', () => {
      const spy = jest.fn(() => 'foo');
      const spy2 = jest.fn(() => 'foo');

      @UntilDestroy()
      class TestComponent {
        static ɵcmp = defineComponent({
          vars: 0,
          decls: 0,
          type: TestComponent,
          selectors: [[]],
          template: () => {}
        }) as ComponentDef<TestComponent>;

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
      // TestComponent.ɵcmp.onDestroy!.call(component);
      component.ngOnDestroy();
    });
  });

  it('should expose loading state', () => {
    const value = new Subject<string>();

    @UntilDestroy()
    class TestComponent {
      static ɵcmp = defineComponent({
        vars: 0,
        decls: 0,
        type: TestComponent,
        selectors: [[]],
        template: () => {}
      }) as ComponentDef<TestComponent>;

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

    // TestComponent.ɵcmp.onDestroy!.call(component);
    component.ngOnDestroy();
  });
});
