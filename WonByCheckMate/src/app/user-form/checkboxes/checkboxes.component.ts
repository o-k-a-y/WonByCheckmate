import { Component, QueryList, ViewChildren } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigService } from 'src/app/services/config-service';
import { Checkbox, CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
  selector: 'app-checkboxes',
  templateUrl: './checkboxes.component.html',
  styleUrls: ['./checkboxes.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxesComponent,
      multi: true
    }
  ]
})
export class CheckboxesComponent implements ControlValueAccessor {
  @ViewChildren(CheckboxComponent) checkboxComponents!: QueryList<CheckboxComponent>;

  checkboxNames: Record<string, string[]> = {
    'bullet': ['30', '60', '60+1', '120+1'],
    'blitz': ['180', '300', '480', '600'],
    'rapid': ['600', '900', '1200', '1800', '3600'],
    'daily': ['1/86400', '1/172800', '1/259200', '1/432000', '1/604800', '1/1209600']
  }

  checkboxesSelected: Record<string, number> = {
    'bullet': 0,
    'blitz': 0,
    'rapid': 0,
    'daily': 0
  }

  numSelected: number; // total amount of checkboxes selected

  constructor(private configService: ConfigService) { }
  
  writeValue(obj: any): void {
    this.numSelected = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  // Called every time the form's value is changed
  onChange = (_: any) => {

  }

  onTouch = (_: any) => {

  }


  // Collect data from checkboxes to be used as query parameters for the API endpoint to filter data returned
  getCheckboxData(): string[] {
    const checkboxData: string[] = [];
    for (const checkboxComponent of this.checkboxComponents) {
      if (checkboxComponent.checkbox != null && checkboxComponent.checkbox.subCheckboxes != null) {
        for (const subCheckbox of checkboxComponent.checkbox.subCheckboxes) {
          if (subCheckbox.completed) {
            // Format data as the API expects it to come in as
            checkboxData.push(`${this.configService.rules.chess}:${checkboxComponent.checkbox.name}:${subCheckbox.name}`);
          }
        }
      }
    }
    return checkboxData;
  }

  updateSelectedCheckboxes(checkbox: Checkbox) {
    let subSelected = 0;
    
    const subCheckboxes = checkbox.subCheckboxes;
    for (const subCheckbox of subCheckboxes) {
      if (subCheckbox.completed) {
        subSelected++;
      }
    }

    this.checkboxesSelected[checkbox.name] = subSelected;

    let numSelected = 0;
    for (const timeClass in this.checkboxesSelected) {
      numSelected += this.checkboxesSelected[timeClass];
    }

    this.numSelected = numSelected;
    this.onChange(this.numSelected);
  }

}
