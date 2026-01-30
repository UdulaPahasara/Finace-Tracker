CREATE OR REPLACE PROCEDURE report_monthly_expenditure_cursor(
    p_user_id IN NUMBER,
    p_month IN VARCHAR2,
    p_result OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT
            category,
            SUM(amount) AS total_amount,
            COUNT(*) AS transaction_count,
            AVG(amount) AS avg_amount
        FROM expense
        WHERE user_id = p_user_id
            AND TO_CHAR(expense_date, 'YYYY-MM') = p_month
        GROUP BY category
        ORDER BY total_amount DESC;
END;
/




CREATE OR REPLACE PROCEDURE report_budget_adherence_cursor(
    p_user_id IN NUMBER,
    p_result OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT
            b.id,
            b.category,
            b.budget_amount,
            NVL(SUM(e.amount), 0) AS actual_spent,
            ROUND((NVL(SUM(e.amount), 0) / b.budget_amount) * 100, 2) AS percentage_used,
            b.budget_amount - NVL(SUM(e.amount), 0) AS remaining_budget,
            CASE
                WHEN (NVL(SUM(e.amount), 0) / b.budget_amount) * 100 >= 100 THEN 'EXCEEDED'
                WHEN (NVL(SUM(e.amount), 0) / b.budget_amount) * 100 >= 80 THEN 'WARNING'
                ELSE 'SAFE'
            END AS status
        FROM budgets b
        LEFT JOIN expense e ON b.user_id = e.user_id AND b.category = e.category
        WHERE b.user_id = p_user_id
        GROUP BY b.id, b.category, b.budget_amount
        ORDER BY percentage_used DESC;
END;
/





CREATE OR REPLACE PROCEDURE report_savings_progress_cursor(
    p_user_id IN NUMBER,
    p_result OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT
            id,
            goal_name,
            target_amount,
            current_amount,
            ROUND((current_amount / target_amount) * 100, 2) AS progress_percentage,
            target_amount - current_amount AS remaining_amount,
            ROUND(MONTHS_BETWEEN(end_date, SYSDATE), 1) AS months_remaining,
            CASE
                WHEN current_amount >= target_amount THEN 'COMPLETED'
                WHEN (current_amount / target_amount) * 100 >= 75 THEN 'ON TRACK'
                WHEN (current_amount / target_amount) * 100 >= 50 THEN 'MIDWAY'
                ELSE 'STARTING'
            END AS goal_status
        FROM savings
        WHERE user_id = p_user_id
        ORDER BY progress_percentage DESC;
END;
/






CREATE OR REPLACE PROCEDURE report_expense_distribution_cursor(
    p_user_id IN NUMBER,
    p_result OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT
            category,
            SUM(amount) AS category_total,
            COUNT(*) AS transaction_count,
            AVG(amount) AS avg_amount,
            MAX(amount) AS max_amount,
            MIN(amount) AS min_amount
        FROM expense
        WHERE user_id = p_user_id
        GROUP BY category
        ORDER BY category_total DESC;
END;
/







CREATE OR REPLACE PROCEDURE report_expense_trends_cursor(
    p_user_id IN NUMBER,
    p_result OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT
            TRUNC(expense_date) AS expense_day,
            SUM(amount) AS daily_total,
            COUNT(*) AS transaction_count
        FROM expense
        WHERE user_id = p_user_id
          AND expense_date >= TRUNC(SYSDATE, 'MM')
        GROUP BY TRUNC(expense_date)
        ORDER BY TRUNC(expense_date);
END;
/
