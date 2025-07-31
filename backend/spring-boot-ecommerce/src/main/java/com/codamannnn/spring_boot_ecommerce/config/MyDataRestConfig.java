package com.codamannnn.spring_boot_ecommerce.config;

import com.codamannnn.spring_boot_ecommerce.entity.Product;
import com.codamannnn.spring_boot_ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST,};

        // disable HTTP methods for Product: PUT,DELETE,POST

        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) ->  httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) ->  httpMethods.disable(theUnsupportedActions));

        // disable HTTP methods for ProductCategory: PUT,DELETE,POST

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) ->  httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) ->  httpMethods.disable(theUnsupportedActions));


    }
}
