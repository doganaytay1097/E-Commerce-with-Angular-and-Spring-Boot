import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Luv2ShopValidators } from '../../validators/luv2-shop-validators';
import { CartService } from '../../services/cart.service';

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
              private luv2ShopFormService: Luv2ShopFormService,
              private cartService: CartService) {}

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[
                                   Validators.required, 
                                   Validators.minLength(2),
                                   Luv2ShopValidators.notOnlyWhiteSpace]),

        lastName: new FormControl('',[
                                  Validators.required, 
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhiteSpace]),
        email:  new FormControl('',[
                                Validators.required, 
                                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({
        country: new FormControl('',[Validators.required]),
        street: new FormControl('',[Validators.required, Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhiteSpace]),

        city: new FormControl('',[Validators.required, Validators.minLength(2),
                                 Luv2ShopValidators.notOnlyWhiteSpace]),

        state: new FormControl('',[Validators.required]),

        zipCode: new FormControl('',[Validators.required, Validators.minLength(2),
                                     Luv2ShopValidators.notOnlyWhiteSpace]),
      }),

      billingAddress:  this.formBuilder.group({
        country: new FormControl('',[Validators.required]),
        street: new FormControl('',[Validators.required, Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhiteSpace]),

        city: new FormControl('',[Validators.required, Validators.minLength(2),
                                 Luv2ShopValidators.notOnlyWhiteSpace]),

        state: new FormControl('',[Validators.required]),

        zipCode: new FormControl('',[Validators.required, Validators.minLength(2),
                                     Luv2ShopValidators.notOnlyWhiteSpace]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',[Validators.required, Validators.minLength(2),
                                        Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required, Validators.pattern('^(?:\\d{16}|\\d{4}(?:[\\s-]?\\d{4}){3})$')]),
        securityCode: new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
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

  reviewCartDetails(){
    this.cartService.totalQuantity.subscribe(
     totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
     );

  }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName');}
  get email(){ return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode');}


  onSubmit(): void {
    console.log("Handling the submit button")

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

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
