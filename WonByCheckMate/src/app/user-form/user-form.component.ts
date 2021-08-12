import { HttpParameterCodec, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormError } from '../models/form-error-enum';
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

  username: string = "";
  formError: FormError = FormError.None;

  
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

  formSubmitted(username: string) {
    this.formError = FormError.None;
    if (username.length < 4) {
      this.formError = FormError.NoUser;
      return;
    }      
    // if (username.len)
    const checkboxData = this.getCheckboxData();

    if (Object.keys(checkboxData).length === 0) {
      this.formError = FormError.NoCheckboxSelected;
      return;
    }
    const request: UsernameRequest = {
      username: username,
      queryParams: this.buildQueryParams()
    };
    this.submitForm.emit(request);
    // this.onSubmitForm.emit(`${username.username}${this.buildQueryString()}`);
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
