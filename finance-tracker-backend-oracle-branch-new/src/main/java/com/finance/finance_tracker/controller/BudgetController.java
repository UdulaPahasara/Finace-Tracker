package com.finance.finance_tracker.controller;


import com.finance.finance_tracker.model.Budgets;
import com.finance.finance_tracker.repository.BudgetsRepository;
import com.finance.finance_tracker.repository.ExpenseRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BudgetController {

    @Autowired
    private BudgetsRepository budgetsRepository;

    @Autowired
    private ExpenseRepository expenseRepository;


    @PostMapping
    public Budgets add(@RequestBody Budgets budgets) {
        return budgetsRepository.save(budgets);
    }

    @GetMapping
    public List<Budgets> list(@RequestParam Integer userId) {
        return budgetsRepository.findByUserId(userId);
    }

    @PutMapping("/{id}")
    public Budgets update(@PathVariable Integer id, @RequestBody Budgets updated) {
        Budgets budgets = budgetsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budgets not found"));
        budgets.setCategory(updated.getCategory());
        budgets.setBudgetAmount(updated.getBudgetAmount());
        budgets.setStartDate(updated.getStartDate());
        budgets.setEndDate(updated.getEndDate());
        budgets.setUserId(updated.getUserId());
        return budgetsRepository.save(budgets);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        budgetsRepository.deleteById(id);
    }


    @GetMapping("/summary")
    public List<Map<String, Object>> getBudgetVsExpenses(@RequestParam Integer userId) {
        // Fetch budgeted amounts per category
        List<Budgets> budgets = budgetsRepository.findByUserId(userId);
        // Fetch actual spent per category
        List<Object[]> spent = expenseRepository.getTotalSpentByCategoryForUser(userId);

        Map<String, Double> spentMap = new HashMap<>();
        for (Object[] row : spent) {
            String category = (String) row[0];
            Double totalSpent = (Double) row[1];
            spentMap.put(category, totalSpent);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Budgets b : budgets) {
            Map<String, Object> item = new HashMap<>();
            item.put("category", b.getCategory());
            item.put("budgetAmount", b.getBudgetAmount());
            Double totalSpent = spentMap.getOrDefault(b.getCategory(), 0.0);
            item.put("totalSpent", totalSpent);
            item.put("remaining", b.getBudgetAmount() - totalSpent);
            item.put("startDate", b.getStartDate());
            item.put("endDate", b.getEndDate());
            result.add(item);
        }
        return result;
    }

    @GetMapping("/budget-vs-expenses/pdf")
    public void exportBudgetVsExpensesPdf(@RequestParam Integer userId, HttpServletResponse response) throws Exception {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=budget_vs_expenses_report.pdf");

        // Get budget per category
        List<Budgets> budgets = budgetsRepository.findByUserId(userId);
        // Get expenses per category
        List<Object[]> expenses = expenseRepository.getTotalSpentByCategoryForUser(userId);

        // Map expenses for lookup
        Map<String, Double> spentMap = new HashMap<>();
        for (Object[] row : expenses) {
            String category = (String) row[0];
            Double totalSpent = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            spentMap.put(category, totalSpent);
        }

        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new Paragraph("Budget vs Expenses Report for User ID: " + userId));
        PdfPTable table = new PdfPTable(5);
        table.addCell("Category");
        table.addCell("Budget Amount");
        table.addCell("Total Spent");
        table.addCell("Remaining");
        table.addCell("Status");

        for (Budgets b : budgets) {
            double spent = spentMap.getOrDefault(b.getCategory(), 0.0);
            double remaining = b.getBudgetAmount() - spent;
            String status = spent > b.getBudgetAmount() ? "Over Budget" : "Within Budget";

            table.addCell(b.getCategory());
            table.addCell(String.valueOf(b.getBudgetAmount()));
            table.addCell(String.valueOf(spent));
            table.addCell(String.valueOf(remaining));
            table.addCell(status);
        }
        document.add(table);
        document.close();
    }

}
