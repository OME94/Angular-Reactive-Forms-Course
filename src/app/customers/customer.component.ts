import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {
  return function (ctrl: AbstractControl): {[key: string]: boolean} | null {
    if (ctrl.value !== null && (isNaN(ctrl.value) || ctrl.value < min || ctrl.value > max)){
      return {'range': true};
    }
    return null;
  };
}

function checkEmails(ctrl: AbstractControl): {[key: string]: boolean} | null {
  const email = ctrl.get('email');
  const confirmEmail = ctrl.get('confirmEmail');

  if (email.pristine || confirmEmail.pristine || (email.value == confirmEmail.value)){
    return null;
  }
  return {'match': true};
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required]
      },
        {validator: checkEmails}
      ),
      phone: '',
      notification: 'email',
      sendCatalog: true
    });

    this.customerForm.get('notification').valueChanges.subscribe(
      val => this.setNotification(val)
    );
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void{
    this.customerForm.setValue({
      firstName: 'Mayor',
      lastName: 'Emman',
      email: 'may@gm.com',
      sendCatalog: false
    })
  }

  setNotification(notifyVia: string): void {
    const phoneControl =  this.customerForm.get('phone');
    if (notifyVia == 'text'){
      phoneControl.setValidators(Validators.required);
    }
    else{
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
}
