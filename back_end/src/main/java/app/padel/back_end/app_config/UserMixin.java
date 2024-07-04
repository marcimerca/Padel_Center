package app.padel.back_end.app_config;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public abstract class UserMixin {
    @JsonIgnore
    public abstract Collection<? extends GrantedAuthority> getAuthorities();
}
