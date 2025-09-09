package com.codamannnn.spring_boot_ecommerce.service;

import com.codamannnn.spring_boot_ecommerce.dto.Purchase;
import com.codamannnn.spring_boot_ecommerce.dto.PurchaseResponse;
import com.codamannnn.spring_boot_ecommerce.entity.Address;
import com.codamannnn.spring_boot_ecommerce.entity.Customer;
import com.codamannnn.spring_boot_ecommerce.entity.Order;
import com.codamannnn.spring_boot_ecommerce.entity.OrderItem;
import com.codamannnn.spring_boot_ecommerce.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;


    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // retrive the order info from dto

        Order order = purchase.getOrder();

        // generate tracking number

        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems

        Set<OrderItem> orderItems = purchase.getOrderItems();
        ///  orderItems.forEach(item -> order.addOrderItem(item));
        orderItems.forEach(order::addOrderItem);

        // populate order with billingAddress and shippingAddress

        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // populate customer with order

        Customer customer = purchase.getCustomer();
        customer.add(order);

        // save to the database

        customerRepository.save(customer);

        // return a response

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}
