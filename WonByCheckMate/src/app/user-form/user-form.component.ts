import { HttpParameterCodec, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UsernameRequest } from '../models/username-request.model';
import { ConfigService } from '../services/config-service';
import { CheckboxComponent } from './checkbox/checkbox.component';

// Encoding is needed in order to pass certain characters such as '+'
// https://betterprogramming.pub/how-to-fix-angular-httpclient-not-escaping-url-parameters-ddce3f9b8746
export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, AfterViewInit {
  @Output() submitForm: EventEmitter<UsernameRequest> = new EventEmitter();
  @ViewChildren(CheckboxComponent) checkboxComponents!: QueryList<CheckboxComponent>;
  
  // Applies validators to the form in the template
  form = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(25)
  ]);

  checkboxNames: Record<string, string[]> = {
    'bullet': ['30', '60', '60+1', '120+1'],
    'blitz': ['180', '300', '480', '600'],
    'rapid': ['600', '900', '1200', '1800', '3600'],
    'daily': ['1/86400', '1/172800', '1/259200', '1/432000', '1/604800', '1/1209600']
  }

  constructor(public configService: ConfigService) { }

  ngAfterViewInit() {
    console.log(this.checkboxComponents);
  }

  ngOnInit(): void {
  }

  formSubmitted() {
    if (this.form.errors) {
      return;
    }

    // console.log(this.form);
    // this.formError = FormError.None;
    // if (this.form.value.length < 4) {
    //   this.formError = FormError.NoUser;
    //   return;
    // }

    const checkboxData = this.getCheckboxData();

    // TODO: Custom validator to check this
    if (Object.keys(checkboxData).length === 0) {
      // this.formError = FormError.NoCheckboxSelected;
      return;
    }

    const request: UsernameRequest = {
      username: this.form.value,
      queryParams: this.buildQueryParams()
    };
    this.submitForm.emit(request);
  }


  // Build the query parameter configs
  buildQueryParams(): HttpParams | undefined {
    const data = this.getCheckboxData();
    if (data.length <= 0) {
      return undefined;
    }

    const queryParam = data.join(',');

    return new HttpParams({
      fromObject: {
        configs: queryParam
      },
      encoder: new CustomHttpParamEncoder()
    })
  }

  // Collect data from checkboxes to be used as query parameters for the API endpoint to filter data returned
  private getCheckboxData(): string[] {
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
    // console.log(checkboxData);
    return checkboxData;
  }
}
