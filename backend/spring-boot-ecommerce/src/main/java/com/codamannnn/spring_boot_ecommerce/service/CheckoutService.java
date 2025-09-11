package com.codamannnn.spring_boot_ecommerce.service;

import com.codamannnn.spring_boot_ecommerce.dto.Purchase;
import com.codamannnn.spring_boot_ecommerce.dto.PurchaseResponse;
import org.springframework.stereotype.Repository;


public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
