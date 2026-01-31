package com.finance.finance_tracker.controller;

import com.finance.finance_tracker.model.Savings;
import com.finance.finance_tracker.repository.SavingsRepository;

import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.lowagie.text.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SavingsController {

    @Autowired
    private SavingsRepository savingsRepository;

    @PostMapping
    public Savings add(@RequestBody Savings savings) {
        return savingsRepository.save(savings);
    }

    @GetMapping
    public List<Savings> list(@RequestParam Integer userId) {
        return savingsRepository.findByUserId(userId);
    }

    // Get percent progress for each savings goal
    @GetMapping("/progress")
    public List<Object[]> progress(@RequestParam Integer userId) {
        return savingsRepository.getSavingsProgress(userId);
    }

    @PutMapping("/{id}")
    public Savings update(@PathVariable Integer id, @RequestBody Savings updated) {
        Savings savings = savingsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Savings goal not found"));
        savings.setGoalName(updated.getGoalName());
        savings.setTargetAmount(updated.getTargetAmount());
        savings.setCurrentAmount(updated.getCurrentAmount());
        savings.setStartDate(updated.getStartDate());
        savings.setEndDate(updated.getEndDate());
        savings.setUserId(updated.getUserId());
        return savingsRepository.save(savings);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        savingsRepository.deleteById(id);
    }

    @GetMapping("/summary")
    public List<Map<String, Object>> savingsSummary(@RequestParam Integer userId) {
        List<Savings> allGoals = savingsRepository.findByUserId(userId);
        List<Map<String, Object>> summary = new ArrayList<>();
        for (Savings s : allGoals) {
            double percent = s.getTargetAmount() != null && s.getTargetAmount() > 0
                    ? 100.0 * s.getCurrentAmount() / s.getTargetAmount()
                    : 0.0;
            Map<String, Object> map = new HashMap<>();
            map.put("goalName", s.getGoalName());
            map.put("currentAmount", s.getCurrentAmount());
            map.put("targetAmount", s.getTargetAmount());
            map.put("percentComplete", percent);
            map.put("startDate", s.getStartDate());
            map.put("endDate", s.getEndDate());
            summary.add(map);
        }
        return summary;
    }

    @GetMapping("/report/pdf")
    public void exportPdf(@RequestParam Integer userId, HttpServletResponse response) throws Exception {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=savings_report.pdf");

        List<Savings> savingsList = savingsRepository.findByUserId(userId);

        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new Paragraph("Savings Goals Report for User ID: " + userId));
        PdfPTable table = new PdfPTable(5); // columns: Goal, Current, Target, %, End

        table.addCell("Goal Name");
        table.addCell("Current Amount");
        table.addCell("Target Amount");
        table.addCell("Percent Complete");
        table.addCell("End Date");

        for (Savings s : savingsList) {
            double percent = s.getTargetAmount() != null && s.getTargetAmount() > 0
                    ? 100.0 * s.getCurrentAmount() / s.getTargetAmount()
                    : 0.0;
            table.addCell(s.getGoalName());
            table.addCell(String.valueOf(s.getCurrentAmount()));
            table.addCell(String.valueOf(s.getTargetAmount()));
            table.addCell(String.format("%.2f%%", percent));
            table.addCell(s.getEndDate());
        }
        document.add(table);
        document.close();
    }

}
