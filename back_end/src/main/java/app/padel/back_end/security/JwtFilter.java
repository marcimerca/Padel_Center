package app.padel.back_end.security;

import app.padel.back_end.entities.User;
import app.padel.back_end.exceptions.NotFoundException;
import app.padel.back_end.exceptions.UnauthorizedException;
import app.padel.back_end.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTool jwtTool;

    @Autowired
    private UserService userService;



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Errore nell'autorizzazione, token mancante!");
        }
        String token = authHeader.substring(7);

        jwtTool.verifyToken(token);

        int userId = jwtTool.getIdFromToken(token);

        Optional<User> utentiOptional = userService.getUserById(userId);

        if(utentiOptional.isPresent()){
            User user = utentiOptional.get();

            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        else{
            throw new NotFoundException("L'utente con id " + userId + " non è stato trovato");
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return new AntPathMatcher().match("/auth/**", request.getServletPath()) ||
                new AntPathMatcher().match("/check-email", request.getServletPath());
    }
}

