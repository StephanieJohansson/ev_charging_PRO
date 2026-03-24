package com.stephanie.ev_charging_pro;

import com.stephanie.ev_charging_pro.dto.AuthResponse;
import com.stephanie.ev_charging_pro.dto.LoginRequest;
import com.stephanie.ev_charging_pro.dto.RegisterRequest;
import com.stephanie.ev_charging_pro.model.Role;
import com.stephanie.ev_charging_pro.model.User;
import com.stephanie.ev_charging_pro.repository.UserRepository;
import com.stephanie.ev_charging_pro.security.JwtService;
import com.stephanie.ev_charging_pro.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginShouldReturnTokenWhenCredentialsAreValid() {
        User user = User.builder()
                .email("janne@mail.com")
                .password("encoded-password")
                .role(Role.USER)
                .build();

        LoginRequest request = new LoginRequest();
        request.setEmail("janne@mail.com");
        request.setPassword("1234");

        when(userRepository.findByEmail("janne@mail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("1234", "encoded-password"))
                .thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(request);

        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("USER", response.getRole());
    }

    @Test
    void loginShouldThrowWhenUserDoesNotExist() {
        LoginRequest request = new LoginRequest();
        request.setEmail("missing@mail.com");
        request.setPassword("1234");

        when(userRepository.findByEmail("missing@mail.com"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authService.login(request)
        );

        assertEquals("Invalid credentials", ex.getMessage());
    }

    @Test
    void loginShouldThrowWhenPasswordIsWrong() {
        User user = User.builder()
                .email("janne@mail.com")
                .password("encoded-password")
                .role(Role.USER)
                .build();

        LoginRequest request = new LoginRequest();
        request.setEmail("janne@mail.com");
        request.setPassword("wrong-password");

        when(userRepository.findByEmail("janne@mail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("wrong-password", "encoded-password"))
                .thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authService.login(request)
        );

        assertEquals("Invalid credentials", ex.getMessage());
    }

    @Test
    void registerShouldCreateUserAndReturnToken() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Janne");
        request.setEmail("janne@mail.com");
        request.setPassword("1234");

        when(userRepository.existsByEmail("janne@mail.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("1234"))
                .thenReturn("encoded-password");

        when(jwtService.generateToken(any(User.class)))
                .thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(request);

        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("USER", response.getRole());
    }

    @Test
    void registerShouldThrowWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Janne");
        request.setEmail("janne@mail.com");
        request.setPassword("1234");

        when(userRepository.existsByEmail("janne@mail.com"))
                .thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                authService.register(request)
        );

        assertEquals("Email already exists!", ex.getMessage());
    }
}
