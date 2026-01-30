package com.finance.finance_tracker.repository;

import com.finance.finance_tracker.model.Budgets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BudgetsRepository extends JpaRepository<Budgets, Integer> {

    List<Budgets> findByUserId(Integer userId);
    List<Budgets> findByUserIdAndCategory(Integer userId, String category);


}
