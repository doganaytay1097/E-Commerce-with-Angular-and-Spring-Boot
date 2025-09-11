package com.codamannnn.spring_boot_ecommerce.config;

import com.codamannnn.spring_boot_ecommerce.entity.Country;
import com.codamannnn.spring_boot_ecommerce.entity.Product;
import com.codamannnn.spring_boot_ecommerce.entity.ProductCategory;
import com.codamannnn.spring_boot_ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.w3c.dom.Entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {


    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST,};

        // disable HTTP methods for Product: PUT,DELETE,POST

        disableHttpsMethods(Product.class,config,theUnsupportedActions);

        // disable HTTP methods for ProductCategory: PUT,DELETE,POST

        disableHttpsMethods(ProductCategory.class,config,theUnsupportedActions);

        // disable HTTP methods for Country: PUT,DELETE,POST

        disableHttpsMethods(Country.class,config,theUnsupportedActions);

        // disable HTTP methods for State: PUT,DELETE,POST

        disableHttpsMethods(State.class,config, theUnsupportedActions);


        // call an internal helper method
        exposeIds(config);
    }

    private static void disableHttpsMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) ->  httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) ->  httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {


        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();
        for (EntityType tempEntityType : entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        Class[] classes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(classes);
    }
}
