-- ============================================
-- ORACLE PL/SQL STORED PROCEDURES
-- Finance Tracker Application
-- ============================================

-- ===== USER CRUD PROCEDURES =====

CREATE OR REPLACE PROCEDURE sp_create_user(
    p_name IN VARCHAR2,
    p_email IN VARCHAR2,
    p_password IN VARCHAR2,
    p_user_id OUT NUMBER
) AS
BEGIN
    INSERT INTO users (name, email, password)
    VALUES (p_name, p_email, p_password)
    RETURNING id INTO p_user_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('User created successfully. ID: ' || p_user_id);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_create_user;
/

CREATE OR REPLACE PROCEDURE sp_get_user(
    p_user_id IN NUMBER
) AS
    v_name VARCHAR2(100);
    v_email VARCHAR2(100);
BEGIN
    SELECT name, email INTO v_name, v_email
    FROM users WHERE id = p_user_id;
    DBMS_OUTPUT.PUT_LINE('User: ' || v_name || ' (' || v_email || ')');
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('User not found');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END sp_get_user;
/

CREATE OR REPLACE PROCEDURE sp_update_user(
    p_user_id IN NUMBER,
    p_name IN VARCHAR2,
    p_email IN VARCHAR2
) AS
BEGIN
    UPDATE users
    SET name = p_name, email = p_email
    WHERE id = p_user_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('User updated successfully');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_update_user;
/

CREATE OR REPLACE PROCEDURE sp_delete_user(
    p_user_id IN NUMBER
) AS
BEGIN
    DELETE FROM users WHERE id = p_user_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('User deleted successfully');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_delete_user;
/

-- ===== EXPENSE CRUD PROCEDURES =====

CREATE OR REPLACE PROCEDURE sp_create_expense(
    p_user_id IN NUMBER,
    p_category IN VARCHAR2,
    p_amount IN NUMBER,
    p_expense_date IN DATE,
    p_description IN VARCHAR2,
    p_expense_id OUT NUMBER
) AS
BEGIN
    INSERT INTO expense (user_id, category, amount, expense_date, description)
    VALUES (p_user_id, p_category, p_amount, p_expense_date, p_description)
    RETURNING id INTO p_expense_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Expense created successfully. ID: ' || p_expense_id);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_create_expense;
/

CREATE OR REPLACE PROCEDURE sp_get_user_expenses(
    p_user_id IN NUMBER
) AS
    CURSOR expense_cursor IS
        SELECT id, category, amount, expense_date, description
        FROM expense WHERE user_id = p_user_id;
BEGIN
    FOR expense_rec IN expense_cursor LOOP
        DBMS_OUTPUT.PUT_LINE(
            'ID: ' || expense_rec.id ||
            ' | Category: ' || expense_rec.category ||
            ' | Amount: ' || expense_rec.amount
        );
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END sp_get_user_expenses;
/

CREATE OR REPLACE PROCEDURE sp_update_expense(
    p_expense_id IN NUMBER,
    p_category IN VARCHAR2,
    p_amount IN NUMBER
) AS
BEGIN
    UPDATE expense
    SET category = p_category, amount = p_amount
    WHERE id = p_expense_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Expense updated successfully');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_update_expense;
/

CREATE OR REPLACE PROCEDURE sp_delete_expense(
    p_expense_id IN NUMBER
) AS
BEGIN
    DELETE FROM expense WHERE id = p_expense_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Expense deleted successfully');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_delete_expense;
/

-- ===== BUDGET CRUD PROCEDURES =====

CREATE OR REPLACE PROCEDURE sp_create_budget(
    p_user_id IN NUMBER,
    p_category IN VARCHAR2,
    p_budget_amount IN NUMBER,
    p_start_date IN DATE,
    p_end_date IN DATE,
    p_budget_id OUT NUMBER
) AS
BEGIN
    INSERT INTO budgets (user_id, category, budget_amount, start_date, end_date)
    VALUES (p_user_id, p_category, p_budget_amount, p_start_date, p_end_date)
    RETURNING id INTO p_budget_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Budget created successfully. ID: ' || p_budget_id);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_create_budget;
/

CREATE OR REPLACE PROCEDURE sp_get_budget(
    p_budget_id IN NUMBER
) AS
    v_category VARCHAR2(50);
    v_budget_amount NUMBER(10,2);
BEGIN
    SELECT category, budget_amount INTO v_category, v_budget_amount
    FROM budgets WHERE id = p_budget_id;
    DBMS_OUTPUT.PUT_LINE('Budget: ' || v_category || ' - ' || v_budget_amount);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Budget not found');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END sp_get_budget;
/

CREATE OR REPLACE PROCEDURE sp_update_budget(
    p_budget_id IN NUMBER,
    p_budget_amount IN NUMBER
) AS
BEGIN
    UPDATE budgets
    SET budget_amount = p_budget_amount
    WHERE id = p_budget_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Budget updated successfully');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_update_budget;
/


CREATE OR REPLACE PROCEDURE sp_delete_budget(
    p_budget_id IN NUMBER
) AS
BEGIN
    DELETE FROM budgets WHERE id = p_budget_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Budget deleted successfully');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_delete_budget;
/

-- ===== SAVINGS CRUD PROCEDURES =====

CREATE OR REPLACE PROCEDURE sp_create_savings(
    p_user_id IN NUMBER,
    p_goal_name IN VARCHAR2,
    p_target_amount IN NUMBER,
    p_current_amount IN NUMBER,
    p_start_date IN DATE,
    p_end_date IN DATE,
    p_savings_id OUT NUMBER
) AS
BEGIN
    INSERT INTO savings (user_id, goal_name, target_amount, current_amount, start_date, end_date)
    VALUES (p_user_id, p_goal_name, p_target_amount, p_current_amount, p_start_date, p_end_date)
    RETURNING id INTO p_savings_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Savings goal created successfully. ID: ' || p_savings_id);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_create_savings;
/


CREATE OR REPLACE PROCEDURE sp_get_savings(
    p_savings_id IN NUMBER
) AS
    v_goal_name VARCHAR2(100);
    v_target_amount NUMBER(12,2);
    v_current_amount NUMBER(12,2);
BEGIN
    SELECT goal_name, target_amount, current_amount
    INTO v_goal_name, v_target_amount, v_current_amount
    FROM savings WHERE id = p_savings_id;
    DBMS_OUTPUT.PUT_LINE(
        'Goal: ' || v_goal_name ||
        ' | Target: ' || v_target_amount ||
        ' | Current: ' || v_current_amount
    );
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Savings goal not found');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END sp_get_savings;
/



CREATE OR REPLACE PROCEDURE sp_update_savings(
    p_savings_id IN NUMBER,
    p_current_amount IN NUMBER
) AS
BEGIN
    UPDATE savings
    SET current_amount = p_current_amount
    WHERE id = p_savings_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Savings updated successfully');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_update_savings;
/

CREATE OR REPLACE PROCEDURE sp_delete_savings(
    p_savings_id IN NUMBER
) AS
BEGIN
    DELETE FROM savings WHERE id = p_savings_id;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Savings goal deleted successfully');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END sp_delete_savings;
/
