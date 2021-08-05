import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfigService } from '../services/config-service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Output() onSubmitForm: EventEmitter<string> = new EventEmitter<string>();
  username: string = "";

  
  checkboxNames: Record<string, string[]> = {
    'bullet': ['30', '60', '60+1', '120+1'],
    'blitz': ['180', '300', '480', '600'],
    'rapid': ['600', '900', '1200', '1800', '3600'],
    'daily': ['1/86400', '1/172800', '1/259200', '1/432000', '1/604800', '1/1209600']
  }

  constructor(public configService: ConfigService) { }

  ngOnInit(): void {
  }


  formSubmitted(username: any) {
    this.onSubmitForm.emit(username.username);
  }
}
