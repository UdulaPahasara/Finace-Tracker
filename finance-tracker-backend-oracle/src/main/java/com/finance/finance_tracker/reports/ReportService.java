package com.finance.finance_tracker.reports;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    // Cursor-based (all that your controller uses for modern reports)
    public List<String> getMonthlyExpenditureCursor(long userId, String month) throws SQLException {
        return reportRepository.getMonthlyExpenditureCursor(userId, month);
    }

    public List<String> getBudgetAdherenceCursor(long userId) throws SQLException {
        return reportRepository.getBudgetAdherenceCursor(userId);
    }

    public List<String> getSavingsProgressCursor(long userId) throws SQLException {
        return reportRepository.getSavingsProgressCursor(userId);
    }

    public List<String> getExpenseDistributionCursor(long userId) throws SQLException {
        return reportRepository.getExpenseDistributionCursor(userId);
    }

    public List<String> getExpenseTrendsCursor(long userId) throws SQLException {
        return reportRepository.getExpenseTrendsCursor(userId);
    }
}
