package app.padel.back_end.app_config;

import app.padel.back_end.entities.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.formLogin(http -> http.disable());
        httpSecurity.csrf(http -> http.disable());
        httpSecurity.sessionManagement(http -> http.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        httpSecurity.cors(Customizer.withDefaults());

        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers( "/auth/**").permitAll());
        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/users/**").permitAll());
        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/campi/**").permitAll());
        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/campi/disponibilita/**").permitAll());
        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/slot-orari/**").permitAll());

        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/partite/**").permitAll());
        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/prenotazioni/**").permitAll());
        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/prenotazione/**").permitAll());
        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/check-email/**").permitAll());


        httpSecurity.authorizeHttpRequests(http -> http.requestMatchers("/**").denyAll());

        return httpSecurity.build();
    }

    @Bean
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper mapper = builder.createXmlMapper(false).build();
        mapper.addMixIn(User.class, UserMixin.class);
        return mapper;
    }
}
