package com.finance.finance_tracker.service;


import com.finance.finance_tracker.model.User;
import com.finance.finance_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // In real apps: check if email already exists, hash password, etc.
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        User found = userRepository.findByEmail(email);
        if (found != null && found.getPassword().equals(password)) {
            return found;
        }
        return null;
    }
}
