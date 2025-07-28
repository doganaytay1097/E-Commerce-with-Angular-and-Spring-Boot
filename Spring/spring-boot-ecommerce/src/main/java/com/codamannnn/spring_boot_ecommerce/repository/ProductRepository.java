package com.codamannnn.spring_boot_ecommerce.repository;

import com.codamannnn.spring_boot_ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product,Long> {
}
