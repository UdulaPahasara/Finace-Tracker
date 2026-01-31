package com.finance.finance_tracker.service;

import com.finance.finance_tracker.controller.SyncController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class AutoSyncService {

    @Autowired
    private SyncController syncController;

    // Runs every 15 minutes (change interval as you need)
    @Scheduled(fixedRate = 60 * 1000)
    public void syncAllToOracle() {
        syncController.syncUsersToOracle();
        syncController.syncBudgetsToOracle();
        syncController.syncExpensesToOracle();
        syncController.syncSavingsToOracle();
        System.out.println("Automatic sync to Oracle completed.");
    }


}
