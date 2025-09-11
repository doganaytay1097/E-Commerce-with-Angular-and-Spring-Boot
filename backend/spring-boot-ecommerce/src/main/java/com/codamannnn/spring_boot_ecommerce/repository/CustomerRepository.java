package com.codamannnn.spring_boot_ecommerce.repository;

import com.codamannnn.spring_boot_ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@Repository
@CrossOrigin("http://localhost:4200")
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
