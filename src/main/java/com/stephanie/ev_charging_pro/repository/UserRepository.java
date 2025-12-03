package com.stephanie.ev_charging_pro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.stephanie.ev_charging_pro.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email); /*to login and authenticate*/

    boolean existsByEmail(String email); /* to check if email is already taken*/
}
