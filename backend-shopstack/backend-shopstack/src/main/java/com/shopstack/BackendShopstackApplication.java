	package com.shopstack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@SuppressWarnings("deprecation")
@SpringBootApplication
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class BackendShopstackApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendShopstackApplication.class, args);
	}

}
