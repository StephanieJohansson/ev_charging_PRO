package com.stephanie.ev_charging_pro.controller;


import com.stephanie.ev_charging_pro.dto.AuthResponse;
import com.stephanie.ev_charging_pro.dto.LoginRequest;
import com.stephanie.ev_charging_pro.dto.RegisterRequest;
import com.stephanie.ev_charging_pro.service.AuthService;
import org.springframework.web.bind.annotation.*;


// controller for authentication, endpoints for registering and logging in users
@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    // exception handling for bad request
    @ExceptionHandler (IllegalArgumentException.class)
    public String handleIllegalArgumentException(IllegalArgumentException e){
        return e.getMessage();
    }
}
