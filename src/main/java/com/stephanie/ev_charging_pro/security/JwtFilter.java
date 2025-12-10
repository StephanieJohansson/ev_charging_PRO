package com.stephanie.ev_charging_pro.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
public class JwtFilter extends OncePerRequestFilter {

    // inject dependencies
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // constructor
    public JwtFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    // validate JWT token in every request
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
        throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // filter out requests without Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); /* remove Bearer from token */

        try {
            String email = jwtService.getEmailFromToken(token); /* get email from token */
            // get role from token
            String role = jwtService.getRoleFromToken(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // validate token and set user authentication in SecurityContext
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                //  make authority based on role
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                // create auth token with authority
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                List.of(authority)
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            System.out.println("JWT Verification failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}