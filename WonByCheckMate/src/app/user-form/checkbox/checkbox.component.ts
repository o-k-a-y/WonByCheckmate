import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ConfigService } from 'src/app/services/config-service';

export interface Checkbox {
  name: string | undefined, 
  completed: boolean,
  color: ThemePalette,
  subCheckboxes?: Checkbox[]
}

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() set checkboxName(name: string) {
    this.checkboxName$.next(name);
  }

  @Input() set subCheckboxNames(names: string[] | undefined) {
    this.subCheckboxNames$.next(names);
  }

  @Output() checkboxesSelected: EventEmitter<Checkbox> = new EventEmitter();

  private readonly checkboxName$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly subCheckboxNames$ = new BehaviorSubject<string[] | undefined>(undefined);

  readonly subCheckboxes$: Observable<Checkbox[]> = this.subCheckboxNames$.pipe(
    map((names) => names?.map((name) => ({ name, completed: false, color: 'accent' })) ?? [])
  );

  readonly checkbox$: Observable<Checkbox> = combineLatest([this.checkboxName$, this.subCheckboxes$]).pipe(
    map(([checkboxName, subCheckboxes]) => {
      return {
        name: checkboxName,
        completed: false,
        color: 'primary',
        subCheckboxes: subCheckboxes
      }
    }),
  );
  checkbox: Checkbox | undefined;
  allComplete: boolean = false;


  private readonly destroyed$ = new ReplaySubject<void>(1);


  someFunctionThatUsesCheckbox() {
    this.checkbox$.pipe(
      // only use a single value (the latest one)
      take(1),
    ).subscribe((checkbox) => {
      // do something with the latest value of `checkbox`
    });
  }

  constructor(public configService: ConfigService) {
    this.checkbox$.pipe(
      // automatically unsubscribe when `this.destroyed$` emits a value
      takeUntil(this.destroyed$),
    ).subscribe((checkbox) => {
      // do something to `checkbox` whenever the value changes
      this.checkbox = checkbox;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // emit a value when the component is destroyed
    this.destroyed$.next();
  }

  updateAllComplete() {
    this.allComplete = this.checkbox?.subCheckboxes != null && this.checkbox.subCheckboxes.every(t => t.completed);
  }

  emitSelected() {
    this.checkboxesSelected.emit(this.checkbox);
  }

  someComplete(): boolean {
    if (this.checkbox?.subCheckboxes == null) {
      return false;
    }
    return this.checkbox.subCheckboxes.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.checkbox?.subCheckboxes == null) {
      return;
    }
    this.checkbox.subCheckboxes.forEach(t => t.completed = completed);

    this.emitSelected();
  }

}