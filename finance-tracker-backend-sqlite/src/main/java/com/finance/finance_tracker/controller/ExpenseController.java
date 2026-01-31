package com.finance.finance_tracker.controller;


import com.finance.finance_tracker.model.Expense;
import com.finance.finance_tracker.repository.ExpenseRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    // Add a new expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseRepository.save(expense);
    }

    // Get all expenses or by userId
    @GetMapping
    public List<Expense> getExpenses(@RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return expenseRepository.findByUserId(userId);
        }
        return expenseRepository.findAll();
    }


    // Update (PUT)
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Integer id, @RequestBody Expense updated) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        expense.setCategory(updated.getCategory());
        expense.setAmount(updated.getAmount());
        expense.setDescription(updated.getDescription());
        expense.setExpenseDate(updated.getExpenseDate());
        expense.setUserId(updated.getUserId());
        return expenseRepository.save(expense);
    }

    // Delete (DELETE)
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Integer id) {
        expenseRepository.deleteById(id);
    }

    @GetMapping("/total")
    public Double getTotalExpensesByUser(@RequestParam Integer userId) {
        return expenseRepository.getTotalAmountByUser(userId);
    }

    @GetMapping("/category-totals")
    public List<Object[]> getCategoryTotals(@RequestParam Integer userId) {
        return expenseRepository.getTotalByCategoryForUser(userId);
    }

    @GetMapping("/monthly-totals")
    public List<Object[]> getMonthlyTotals(@RequestParam Integer userId) {
        return expenseRepository.getMonthlyTotals(userId);
    }

    @GetMapping("/top-category")
    public Object[] getTopCategory(@RequestParam Integer userId) {
        return expenseRepository.getTopCategory(userId);
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary(@RequestParam Integer userId) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("total", expenseRepository.getTotalAmountByUser(userId));
        summary.put("monthly", expenseRepository.getMonthlyTotals(userId));
        summary.put("categoryTotals", expenseRepository.getTotalByCategoryForUser(userId));
        summary.put("topCategory", expenseRepository.getTopCategory(userId));
        return summary;
    }

    @GetMapping("/export")
    public void exportExpenses(@RequestParam Integer userId, HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
        List<Expense> expenses = expenseRepository.findByUserId(userId);

        PrintWriter writer = response.getWriter();
        writer.println("id,userId,expenseDate,category,amount,description");
        for (Expense e : expenses) {
            writer.println(String.format("%d,%d,%s,%s,%.2f,%s",
                    e.getId(), e.getUserId(), e.getExpenseDate(), e.getCategory(), e.getAmount(), e.getDescription()
            ));
        }
        writer.flush();
        writer.close();
    }

}
