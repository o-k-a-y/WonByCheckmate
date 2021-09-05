import { HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsernameRequest } from '../models/username-request.model';
import { ConfigService } from '../services/config-service';
import { CheckboxesComponent } from './checkboxes/checkboxes.component';

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
export class UserFormComponent implements OnInit {
  @Output() submitForm: EventEmitter<UsernameRequest> = new EventEmitter();

  @ViewChild(CheckboxesComponent) checkboxesComponent!: CheckboxesComponent;
  
  form: FormGroup;
  
  constructor(public configService: ConfigService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.applyValidators();
  }

  // Applies validators to the form in the template
  applyValidators() {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(25)
      ]],
      checkboxes: [0, {validators: [Validators.required, Validators.min(1)]}]
    });
  }

  onSubmit() {
    console.log('onSubmit')
    console.log(this.form.value)
    console.log(this.form.valid)
  }

  formSubmitted() {
    if (!this.form.valid) {
      return;
    }

    const request: UsernameRequest = {
      username: this.form.get('username').value,
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
    return this.checkboxesComponent.getCheckboxData();
  }
}
