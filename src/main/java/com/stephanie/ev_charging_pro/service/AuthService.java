package com.stephanie.ev_charging_pro.service;


import com.stephanie.ev_charging_pro.dto.AuthResponse;
import com.stephanie.ev_charging_pro.dto.LoginRequest;
import com.stephanie.ev_charging_pro.dto.RegisterRequest;
import com.stephanie.ev_charging_pro.model.Role;
import com.stephanie.ev_charging_pro.model.User;
import com.stephanie.ev_charging_pro.repository.UserRepository;
import com.stephanie.ev_charging_pro.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email already exists!");
        }


        User user = User.builder()
                .username(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }


        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }
}
