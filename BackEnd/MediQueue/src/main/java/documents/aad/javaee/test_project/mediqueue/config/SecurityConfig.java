package documents.aad.javaee.test_project.mediqueue.config;

import documents.aad.javaee.test_project.mediqueue.utill.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml",
                                "/actuator/**",
                                "/avatars/**",
                                "/patient_avatars/**"
                        ).permitAll()
                        .requestMatchers("/auth/**", "/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/admin/users/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/api/v1/patient/**").hasAuthority("PATIENT")
                        .requestMatchers("/api/v1/admin/assignments/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

//        package documents.aad.javaee.test_project.mediqueue.config;
//        import documents.aad.javaee.test_project.mediqueue.utill.JwtAuthFilter;
//        import lombok.RequiredArgsConstructor;
//        import org.springframework.context.annotation.Bean;
//        import org.springframework.context.annotation.Configuration;
//        import org.springframework.security.authentication.AuthenticationProvider;
//        import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//        import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//        import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//        import org.springframework.security.config.http.SessionCreationPolicy;
//        import org.springframework.security.web.SecurityFilterChain;
//        import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//        @Configuration @EnableWebSecurity @RequiredArgsConstructor public class SecurityConfig
//        { private final JwtAuthFilter jwtAuthFilter;
//        private final AuthenticationProvider authenticationProvider;
//        @Bean public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
//        { http .csrf(AbstractHttpConfigurer::disable)
//        .authorizeHttpRequests(auth -> auth .requestMatchers("/avatars/**","/swagger-ui.html",
// optional redirect "/swagger-ui/", "/v3/api-docs", // UI files "/v3/api-docs/", // JSON / YAML docs "/v3/api-docs.yaml", "/actuator/**", "/patient_avatars/**").permitAll() .requestMatchers("/avatars/**").permitAll() .requestMatchers("/auth/**").permitAll() .requestMatchers("/api/v1/auth/**").permitAll() .requestMatchers("/api/v1/admin/users/**").hasAuthority("ADMIN") .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN") .requestMatchers("/api/v1/patient/**").hasAuthority("PATIENT") .requestMatchers("/api/v1/admin/assignments/**").hasAuthority("ADMIN") .anyRequest().authenticated() ) .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) .authenticationProvider(authenticationProvider) .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); return http.build(); }