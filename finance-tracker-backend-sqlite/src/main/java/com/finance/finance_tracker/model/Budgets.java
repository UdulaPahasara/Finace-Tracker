package com.finance.finance_tracker.model;


import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budgets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    private String category;

    @Column(name = "budget_amount")
    private Double budgetAmount;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    // Getters and setters for all fields
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getBudgetAmount() { return budgetAmount; }
    public void setBudgetAmount(Double budgetAmount) { this.budgetAmount = budgetAmount; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
}
