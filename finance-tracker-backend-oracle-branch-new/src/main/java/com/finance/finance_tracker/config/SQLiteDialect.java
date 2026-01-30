package com.finance.finance_tracker.config;

import org.hibernate.dialect.Dialect;
import org.hibernate.dialect.identity.IdentityColumnSupport;
import org.hibernate.dialect.identity.IdentityColumnSupportImpl;


public class SQLiteDialect extends Dialect {

    public SQLiteDialect() {
        super();
    }

    public IdentityColumnSupport getIdentityColumnSupport() {
        return new IdentityColumnSupportImpl();
    }

    public boolean supportsLimit() {
        return true;
    }

    public String getLimitString(String query, boolean hasOffset) {
        return query + (hasOffset ? " LIMIT ? OFFSET ?" : " LIMIT ?");
    }
}

