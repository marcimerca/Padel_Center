package app.padel.back_end.app_config;

import app.padel.back_end.entities.User;
import com.cloudinary.Cloudinary;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.catalina.filters.CorsFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@EnableAsync
public class AppConfig  {

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


    @Bean
    public JavaMailSenderImpl getJavaMailSender(@Value("${gmail.mail.transport.protocol}" )String protocol,
                                                @Value("${gmail.mail.smtp.auth}" ) String auth,
                                                @Value("${gmail.mail.smtp.starttls.enable}" )String starttls,
                                                @Value("${gmail.mail.debug}" )String debug,
                                                @Value("${gmail.mail.from}" )String from,
                                                @Value("${gmail.mail.from.password}" )String password,
                                                @Value("${gmail.smtp.ssl.enable}" )String ssl,
                                                @Value("${gmail.smtp.host}" )String host,
                                                @Value("${gmail.smtp.port}" )String port){
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(Integer.parseInt(port));

        mailSender.setUsername(from);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", protocol);
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", starttls);
        props.put("mail.debug", debug);
        props.put("smtp.ssl.enable",ssl);

        return mailSender;

    }

    @Bean
    public Cloudinary getCloudinary(@Value("${cloudinary.name}") String name,
                                    @Value("${cloudinary.apikey}") String apikey,
                                    @Value("${cloudinary.secret}") String secret) {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", name);
        config.put("api_key", apikey);
        config.put("api_secret", secret);
        return new Cloudinary(config);

    }






}
