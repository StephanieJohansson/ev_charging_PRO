package com.stephanie.ev_charging_pro.security;


import com.stephanie.ev_charging_pro.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

// service class to generate and validate JWT tokens
@Service
public class JwtService {

    // generate token
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(User user){
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());

        return createToken(claims, user.getEmail());
    }

    public String createToken(Map<String, Object> claims, String subject){
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) /*1 hour*/
                .signWith(key)
                .compact();
    }

    // get email from token
    public String getEmailFromToken(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // get role from token
    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }
}
