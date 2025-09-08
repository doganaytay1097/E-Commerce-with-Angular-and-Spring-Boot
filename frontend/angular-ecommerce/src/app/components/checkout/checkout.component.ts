import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup = new FormGroup({});
  totalPrice:number = 0;
  totalQuantity:number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country:[''],
        street:[''],
        city:[''],
        state:[''],
        zipCode:[''],
      }),
      billingAddress: this.formBuilder.group({
        country:[''],
        street:[''],
        city:[''],
        state:[''],
        zipCode:[''],
      }),
      creditCard: this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expirationMonth:[''],
        expirationYear:[''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth:" + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " +JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card Years: " +JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries

    this.luv2ShopFormService.getCountries().subscribe(
      data=>{
        console.log("");
        this.countries = data;
      }
    );

     // populate states

    this.luv2ShopFormService.getCountries().subscribe(
      data=>{
        console.log("Retrieved Countries: "+JSON.stringify(data));
        this.countries = data;
      }
    )

  }


  onSubmit(): void {
    console.log("Handling the submit button")
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is "+this.checkoutFormGroup.get('customer')?.value.email);

    console.log("The Shipping address country is "+this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The Shipping address state is "+this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
  }

  copyShippingAddresstoBillingAddress(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    const shipping = this.checkoutFormGroup.get('shippingAddress') as FormGroup;
    const billing  = this.checkoutFormGroup.get('billingAddress') as FormGroup;
  
    if (input?.checked) {
      // 1) Form değerlerini kopyala
      billing.setValue(shipping.value);
  
      // 2) Shipping'in state listesini billing'e kopyala
      this.billingAddressStates = [...this.shippingAddressStates];

  
    } else {
      billing.reset();
      this.billingAddressStates = [];  // listeyi de temizle
    }
  }
  

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    
    // if the current year equals selected year, then start with current month

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " +JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }
  
  getStates(formGroupName: string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} countryCode: ${countryCode}`);
    console.log(`${formGroupName} countryName: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        if (formGroup) {
          formGroup.get('state')?.setValue(data[0]);
        }
      }
    )
  }
}
