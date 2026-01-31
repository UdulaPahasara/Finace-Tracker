package com.finance.finance_tracker.repository;

import com.finance.finance_tracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Integer> {

    List<Expense> findByUserId(Integer userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId")
    Double getTotalAmountByUser(@Param("userId") Integer userId);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.userId = :userId GROUP BY e.category")
    List<Object[]> getTotalByCategoryForUser(@Param("userId") Integer userId);

    @Query("SELECT strftime('%Y-%m', e.expenseDate) AS month, SUM(e.amount) " +
            "FROM Expense e WHERE e.userId = :userId " +
            "GROUP BY month ORDER BY month DESC")
    List<Object[]> getMonthlyTotals(@Param("userId") Integer userId);

    @Query(value = "SELECT category, SUM(amount) as total " +
            "FROM expense WHERE user_id = :userId " +
            "GROUP BY category ORDER BY total DESC LIMIT 1",
            nativeQuery = true)
    Object[] getTopCategory(@Param("userId") Integer userId);


    @Query("SELECT e.category, SUM(e.amount) " +
            "FROM Expense e WHERE e.userId = :userId GROUP BY e.category")
    List<Object[]> getTotalSpentByCategoryForUser(@Param("userId") Integer userId);


}
