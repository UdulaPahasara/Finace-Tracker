package com.finance.finance_tracker.controller;

import com.finance.finance_tracker.model.Budgets;
import com.finance.finance_tracker.model.Expense;
import com.finance.finance_tracker.model.Savings;
import com.finance.finance_tracker.model.User;
import com.finance.finance_tracker.repository.BudgetsRepository;
import com.finance.finance_tracker.repository.ExpenseRepository;
import com.finance.finance_tracker.repository.SavingsRepository;
import com.finance.finance_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/api/sync")
public class SyncController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BudgetsRepository budgetsRepository;
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private SavingsRepository savingsRepository;

    @Autowired
    private RestTemplate restTemplate;


    @PostMapping("/users-to-oracle")
    public String syncUsersToOracle() {
        List<User> users = userRepository.findAll();
        int successCount = 0;
        int duplicateCount = 0;

        for (User user : users) {
            try {
                // Create a new user without ID
                User userToSync = new User();
                userToSync.setName(user.getName());
                userToSync.setEmail(user.getEmail());
                userToSync.setPassword(user.getPassword());

                // Try to register in Oracle
                restTemplate.postForObject(
                        "http://localhost:8083/api/users/register",
                        userToSync,
                        User.class
                );
                System.out.println("Synced user: " + user.getEmail());
                successCount++;
            } catch (Exception e) {
                if (e.getMessage().contains("unique constraint") || e.getMessage().contains("ORA-00001")) {
                    System.out.println("User already exists in Oracle: " + user.getEmail());
                    duplicateCount++;
                } else {
                    System.out.println("Failed to sync user: " + user.getEmail() + " - " + e.getMessage());
                }
            }
        }

        return "Sync completed! Success: " + successCount + ", Duplicates skipped: " + duplicateCount;
    }


    // SYNC BUDGETS

    @PostMapping("/sqlite-to-oracle/budgets")
    public String syncBudgetsToOracle() {
        List<Budgets> budgetsList = budgetsRepository.findAll();
        int successCount = 0;
        int duplicateCount = 0;

        for (Budgets budget : budgetsList) {
            try {
                // Create a new budget without ID
                Budgets budgetToSync = new Budgets();
                budgetToSync.setUserId(budget.getUserId());
                budgetToSync.setCategory(budget.getCategory());
                budgetToSync.setBudgetAmount(budget.getBudgetAmount());
                budgetToSync.setStartDate(budget.getStartDate());
                budgetToSync.setEndDate(budget.getEndDate());

                // Try to insert in Oracle
                restTemplate.postForObject(
                        "http://localhost:8083/api/budgets",
                        budgetToSync,
                        Budgets.class
                );
                System.out.println("Synced budget: " + budget.getCategory());
                successCount++;
            } catch (Exception e) {
                if (e.getMessage().contains("unique constraint") || e.getMessage().contains("ORA-00001")) {
                    System.out.println("Budget already exists in Oracle: " + budget.getCategory());
                    duplicateCount++;
                } else {
                    System.out.println("Failed to sync budget: " + budget.getCategory() + " - " + e.getMessage());
                }
            }
        }

        return "Sync completed! Success: " + successCount + ", Duplicates skipped: " + duplicateCount;
    }


    // SYNC EXPENSES
    @PostMapping("/sqlite-to-oracle/expenses")
    public String syncExpensesToOracle() {
        List<Expense> expenses = expenseRepository.findAll();
        int successCount = 0;
        int duplicateCount = 0;

        for (Expense expense : expenses) {
            try {
                // Create a new expense without ID
                Expense expenseToSync = new Expense();
                expenseToSync.setUserId(expense.getUserId());
                expenseToSync.setCategory(expense.getCategory());
                expenseToSync.setAmount(expense.getAmount());
                expenseToSync.setExpenseDate(expense.getExpenseDate());
                expenseToSync.setDescription(expense.getDescription());

                // Try to insert in Oracle
                restTemplate.postForObject(
                        "http://localhost:8083/api/expenses",
                        expenseToSync,
                        Expense.class
                );
                System.out.println("Synced expense: " + expense.getCategory());
                successCount++;
            } catch (Exception e) {
                if (e.getMessage().contains("unique constraint") || e.getMessage().contains("ORA-00001")) {
                    System.out.println("Expense already exists in Oracle: " + expense.getCategory());
                    duplicateCount++;
                } else {
                    System.out.println("Failed to sync expense: " + expense.getCategory() + " - " + e.getMessage());
                }
            }
        }

        return "Sync completed! Success: " + successCount + ", Duplicates skipped: " + duplicateCount;
    }





    // SYNC SAVINGS
    @PostMapping("/sqlite-to-oracle/savings")
    public String syncSavingsToOracle() {
        List<Savings> savingsList = savingsRepository.findAll();
        int successCount = 0;
        int duplicateCount = 0;

        for (Savings savings : savingsList) {
            try {
                // Create a new savings without ID
                Savings savingsToSync = new Savings();
                savingsToSync.setUserId(savings.getUserId());
                savingsToSync.setGoalName(savings.getGoalName());
                savingsToSync.setTargetAmount(savings.getTargetAmount());
                savingsToSync.setCurrentAmount(savings.getCurrentAmount());
                savingsToSync.setStartDate(savings.getStartDate());
                savingsToSync.setEndDate(savings.getEndDate());

                // Try to insert in Oracle
                restTemplate.postForObject(
                        "http://localhost:8083/api/savings",
                        savingsToSync,
                        Savings.class
                );
                System.out.println("Synced savings: " + savings.getGoalName());
                successCount++;
            } catch (Exception e) {
                if (e.getMessage().contains("unique constraint") || e.getMessage().contains("ORA-00001")) {
                    System.out.println("Savings already exists in Oracle: " + savings.getGoalName());
                    duplicateCount++;
                } else {
                    System.out.println("Failed to sync savings: " + savings.getGoalName() + " - " + e.getMessage());
                }
            }
        }

        return "Sync completed! Success: " + successCount + ", Duplicates skipped: " + duplicateCount;
    }
}
