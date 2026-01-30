package com.finance.finance_tracker.repository;

import com.finance.finance_tracker.model.Savings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SavingsRepository extends JpaRepository<Savings, Integer> {

    List<Savings> findByUserId(Integer userId);

    // Progress as percent to target for each saving goal
    @Query("SELECT s.goalName, (s.currentAmount/s.targetAmount)*100 FROM Savings s WHERE s.userId = :userId")
    List<Object[]> getSavingsProgress(@Param("userId") Integer userId);
}
