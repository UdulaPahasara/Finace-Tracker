package com.finance.finance_tracker.controller;


import com.finance.finance_tracker.model.User;
import com.finance.finance_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Register
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        // In real apps: validate & hash password
        return userRepository.save(user);
    }

    // Login
    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {
        User found = userRepository.findByEmail(user.getEmail());
        // Simple check for demo; for real use, compare hashed password & handle errors
        if (found != null && found.getPassword().equals(user.getPassword())) {
            return found;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
