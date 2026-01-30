package com.finance.finance_tracker.reports;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @GetMapping("/monthly-expenditure-cursor")
    public ResponseEntity<List<String>> getMonthlyExpenditureCursor(
            @RequestParam long userId,
            @RequestParam String month) throws Exception {
        return ResponseEntity.ok(reportService.getMonthlyExpenditureCursor(userId, month));
    }

    @GetMapping("/budget-adherence-cursor")
    public ResponseEntity<List<String>> getBudgetAdherenceCursor(
            @RequestParam long userId) throws Exception {
        return ResponseEntity.ok(reportService.getBudgetAdherenceCursor(userId));
    }

    @GetMapping("/savings-progress-cursor")
    public ResponseEntity<List<String>> getSavingsProgressCursor(
            @RequestParam long userId) throws Exception {
        return ResponseEntity.ok(reportService.getSavingsProgressCursor(userId));
    }

    @GetMapping("/expense-distribution-cursor")
    public ResponseEntity<List<String>> getExpenseDistributionCursor(
            @RequestParam long userId) throws Exception {
        return ResponseEntity.ok(reportService.getExpenseDistributionCursor(userId));
    }

    @GetMapping("/expense-trends-cursor")
    public ResponseEntity<List<String>> getExpenseTrendsCursor(
            @RequestParam long userId) throws Exception {
        return ResponseEntity.ok(reportService.getExpenseTrendsCursor(userId));
    }
}

