package com.example.quiz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean("generalRestTemplate")
    public RestTemplate generalRestTemplate() {
        return new RestTemplate();
    }
}
