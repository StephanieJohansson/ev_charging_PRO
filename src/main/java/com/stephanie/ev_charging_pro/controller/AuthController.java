package com.stephanie.ev_charging_pro.controller;


import com.stephanie.ev_charging_pro.dto.AuthResponse;
import com.stephanie.ev_charging_pro.dto.LoginRequest;
import com.stephanie.ev_charging_pro.dto.RegisterRequest;
import com.stephanie.ev_charging_pro.model.User;
import com.stephanie.ev_charging_pro.repository.UserRepository;
import com.stephanie.ev_charging_pro.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


// controller for authentication, endpoints for registering and logging in users
@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PutMapping("/profile")
    public User updateProfile(@RequestBody UpdateProfileDTO dto, Authentication auth) {

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());

        return userRepository.save(user);
    }


    // exception handling for bad request
    @ExceptionHandler (IllegalArgumentException.class)
    public String handleIllegalArgumentException(IllegalArgumentException e){
        return e.getMessage();
    }
}
