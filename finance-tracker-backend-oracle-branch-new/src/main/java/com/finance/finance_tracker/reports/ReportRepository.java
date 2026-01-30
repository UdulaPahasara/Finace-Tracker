package com.finance.finance_tracker.reports;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ReportRepository {

    @Autowired
    private DataSource dataSource;

    // CURSOR-BASED VERSIONS: Use these for 100% reliable output

    public List<String> getMonthlyExpenditureCursor(long userId, String month) throws SQLException {
        List<String> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            CallableStatement cs = conn.prepareCall("{call report_monthly_expenditure_cursor(?, ?, ?)}");
            cs.setLong(1, userId);
            cs.setString(2, month);
            cs.registerOutParameter(3, oracle.jdbc.OracleTypes.CURSOR);
            cs.execute();
            ResultSet rs = (ResultSet) cs.getObject(3);
            while (rs.next()) {
                String line = "Category: " + rs.getString("category")
                        + " | Total: " + rs.getBigDecimal("total_amount")
                        + " | Count: " + rs.getInt("transaction_count")
                        + " | Avg: " + rs.getBigDecimal("avg_amount");
                results.add(line);
            }
            rs.close();
        }
        return results;
    }

    public List<String> getBudgetAdherenceCursor(long userId) throws SQLException {
        List<String> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            CallableStatement cs = conn.prepareCall("{call report_budget_adherence_cursor(?, ?)}");
            cs.setLong(1, userId);
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CURSOR);
            cs.execute();
            ResultSet rs = (ResultSet) cs.getObject(2);
            while (rs.next()) {
                String line = "Category: " + rs.getString("category")
                        + " | Budget: " + rs.getBigDecimal("budget_amount")
                        + " | Spent: " + rs.getBigDecimal("actual_spent")
                        + " | Used: " + rs.getBigDecimal("percentage_used") + "%"
                        + " | Remaining: " + rs.getBigDecimal("remaining_budget")
                        + " | Status: " + rs.getString("status");
                results.add(line);
            }
            rs.close();
        }
        return results;
    }

    public List<String> getSavingsProgressCursor(long userId) throws SQLException {
        List<String> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            CallableStatement cs = conn.prepareCall("{call report_savings_progress_cursor(?, ?)}");
            cs.setLong(1, userId);
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CURSOR);
            cs.execute();
            ResultSet rs = (ResultSet) cs.getObject(2);
            while (rs.next()) {
                String line = "Goal: " + rs.getString("goal_name")
                        + " | Target: " + rs.getBigDecimal("target_amount")
                        + " | Current: " + rs.getBigDecimal("current_amount")
                        + " | Progress: " + rs.getBigDecimal("progress_percentage") + "%"
                        + " | Remaining: " + rs.getBigDecimal("remaining_amount")
                        + " | Status: " + rs.getString("goal_status");
                results.add(line);
            }
            rs.close();
        }
        return results;
    }

    public List<String> getExpenseDistributionCursor(long userId) throws SQLException {
        List<String> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            CallableStatement cs = conn.prepareCall("{call report_expense_distribution_cursor(?, ?)}");
            cs.setLong(1, userId);
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CURSOR);
            cs.execute();
            ResultSet rs = (ResultSet) cs.getObject(2);
            while (rs.next()) {
                String line = "Category: " + rs.getString("category")
                        + " | Total: " + rs.getBigDecimal("category_total")
                        + " | Count: " + rs.getInt("transaction_count")
                        + " | Avg: " + rs.getBigDecimal("avg_amount")
                        + " | Max: " + rs.getBigDecimal("max_amount")
                        + " | Min: " + rs.getBigDecimal("min_amount");
                results.add(line);
            }
            rs.close();
        }
        return results;
    }

    public List<String> getExpenseTrendsCursor(long userId) throws SQLException {
        List<String> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            CallableStatement cs = conn.prepareCall("{call report_expense_trends_cursor(?, ?)}");
            cs.setLong(1, userId);
            cs.registerOutParameter(2, oracle.jdbc.OracleTypes.CURSOR);
            cs.execute();
            ResultSet rs = (ResultSet) cs.getObject(2);
            while (rs.next()) {
                String line = "Date: " + rs.getDate("expense_day")
                        + " | Daily Total: " + rs.getBigDecimal("daily_total")
                        + " | Transactions: " + rs.getInt("transaction_count");
                results.add(line);
            }
            rs.close();
        }
        return results;
    }

    // DBMS_OUTPUT methods (for legacy/testing/reference, not used in your main API but kept here)
    public String runOracleReport(Connection conn, String procedureCall, Object... params) throws SQLException {
        Statement stmt = conn.createStatement();
        stmt.execute("BEGIN DBMS_OUTPUT.ENABLE(1000000); END;");
        CallableStatement cs = conn.prepareCall(procedureCall);
        for (int i = 0; i < params.length; i++) {
            cs.setObject(i + 1, params[i]);
        }
        cs.execute();
        List<String> lines = new ArrayList<>();
        CallableStatement csOut = conn.prepareCall(
                "DECLARE " +
                        "  line VARCHAR2(32767); " +
                        "  status INTEGER; " +
                        "BEGIN " +
                        "  LOOP " +
                        "    DBMS_OUTPUT.GET_LINE(line, status); " +
                        "    EXIT WHEN status = 1; " +
                        "    ? := line; " +
                        "  END LOOP; " +
                        "END;"
        );
        csOut.registerOutParameter(1, Types.VARCHAR);
        while (true) {
            csOut.execute();
            String line = csOut.getString(1);
            if (line == null) break;
            lines.add(line);
        }
        return String.join("\n", lines);
    }
}
