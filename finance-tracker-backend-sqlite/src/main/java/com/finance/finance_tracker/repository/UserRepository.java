package com.finance.finance_tracker.repository;

import com.finance.finance_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email); // for login
}
