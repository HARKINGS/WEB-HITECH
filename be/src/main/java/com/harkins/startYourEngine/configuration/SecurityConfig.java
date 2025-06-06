package com.harkins.startYourEngine.configuration;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private static final String[] ALL_METHOD_PUBLIC_ENDPOINTS = {"/orders/**", "/zalopay/**"};
    private static final String[] POST_PUBLIC_ENDPOINTS = {"/auth/**", "/reviews/create"};
    private static final String[] GET_PUBLIC_ENDPOINTS = {
        "/goods/**", "/reviews", "/vouchers", "/vouchers/**", "/files/upload"
    };

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    Set<String> userPermissions = Set.of(
            "GET_REVIEWS_BY_GOODS",
            "GET_ALL_GOODS",
            "GET_GOODS_BY_ID",
            "GET_GOODS_BY_NAME",
            "GET_GOODS_BY_CATEGORY",
            "GET_GOODS_BY_BRANCH",
            "GET_GOODS_BY_PRICE_RANGE",
            "GET_GOODS_BY_PRICE",
            "GET_GOODS_BY_RATING",
            "GET_GOODS_SORTED",
            "GET_VOUCHER",
            "GET_ALL_VOUCHERS",
            "CREATE_REVIEWS",
            "GET_ALL_REVIEWS",
            "GET_REVIEWS_BY_ID",
            "PLACE_ORDER",
            "DELETE_ORDER",
            "UPDATE_ORDERITEM",
            "GET_ORDER_BY_ID",
            "GET_CURRENT_USERORDERS",
            "UPDATE_ORDER_STATUS",
            "UPDATE_PAYMENT_STATUS",
            "GET_ALL_ORDERS",
            "GET_ORDERS_BY_STATUS",
            "GET_ORDERS_BY_USERID",
            "GET_ORDER_STATUS",
            "CREATE_ORDER",
            "UPDATE_ORDER_TRANSACTIONID");

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request.requestMatchers(ALL_METHOD_PUBLIC_ENDPOINTS)
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, POST_PUBLIC_ENDPOINTS)
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, GET_PUBLIC_ENDPOINTS)
                        .permitAll()
                        .requestMatchers("/uploads/**")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .anonymous(anon -> anon.authorities(userPermissions.toArray(new String[0])))
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt ->
                                jwt.decoder(customJwtDecoder).jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint()))
                .csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
