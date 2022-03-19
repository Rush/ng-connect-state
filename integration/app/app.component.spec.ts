import {
  ɵivyEnabled as ivyEnabled,
  Component,
  Directive,
  Pipe
} from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { connectState } from 'ng-connect-state';
import { UntilDestroy } from '@ngneat/until-destroy';

describe('connectState runtime behavior', () => {
  it('ivy has to be enabled', () => {
    // This assertion has to be performed as we have to
    // be sure that we're running these tests with the Ivy engine
    expect(ivyEnabled).toBeTruthy();
  });

  it('should unsubscribe from the component property', () => {
    // Arrange
    @Component({ template: '' })
    @UntilDestroy()
    class MockComponent {
      disposed = false;

      ngOnDestroy() {
      }

      state = connectState(this, {
        val: new Subject().pipe(finalize(() => { this.disposed = true; }))
      });

    }

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent]
    });

    const fixture = TestBed.createComponent(MockComponent);

    // Assert
    expect(fixture.componentInstance.disposed).toBeFalsy();
    fixture.destroy();
    expect(fixture.componentInstance.disposed).toBeTruthy();
  });

  it('should unsubscribe from the directive property', () => {
    // Arrange
    @Component({
      template: '<div test></div>'
    })
    @UntilDestroy()
    class MockComponent {}

    @Directive({ selector: '[test]' })
    class MockDirective {
      disposed = false;

      state = connectState(this, {
        val: new Subject().pipe(finalize(() => { this.disposed = true; }))
      });

      ngOnDestroy() { }
    }

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent, MockDirective]
    });

    const fixture = TestBed.createComponent(MockComponent);
    fixture.detectChanges();

    const elementWithDirective = fixture.debugElement.query(By.directive(MockDirective));
    const directive = elementWithDirective.injector.get(MockDirective);
    fixture.destroy();

    // Assert
    expect(directive.disposed).toBeTruthy();
  });

  it('should unsubscribe from pipe property', fakeAsync(() => {
    // Arrange
    let disposed = false;

    @Pipe({ name: 'mock', pure: false })
    @UntilDestroy()
    class MockPipe {
      disposed = false;

      state = connectState(this, {
        val: new BehaviorSubject('XX').pipe(finalize(() => {
          disposed = true;
        }))
      });

      ngOnDestroy() { }

      transform(): string {
        return 'I have been piped' + this.state.val;
      }
    }

    @UntilDestroy()
    @Component({
      template: `
        <div>{{ 'foo' | mock }}</div>
      `
    })
    class MockComponent {}

    // Act
    TestBed.configureTestingModule({
      declarations: [MockComponent, MockPipe]
    });

    expect(disposed).toBeFalsy();
    const fixture = TestBed.createComponent(MockComponent);
    tick(1);
    fixture.detectChanges();
    tick(1);
    expect(fixture.nativeElement.innerHTML).toEqual('<div>I have been pipedXX</div>');

    fixture.destroy();

    // Assert
    expect(disposed).toBeTruthy();
  }));
});
