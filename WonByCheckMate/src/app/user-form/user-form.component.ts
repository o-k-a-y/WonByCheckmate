import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Output() onSubmitForm: EventEmitter<string> = new EventEmitter<string>();
  username: string
  constructor() { }

  ngOnInit(): void {
  }


  formSubmitted(username: any) {
    this.onSubmitForm.emit(username.username);
    console.log(username);
  }
}
