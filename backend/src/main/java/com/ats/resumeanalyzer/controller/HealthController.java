package com.ats.resumeanalyzer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "ATS Resume Analyzer Backend is running 🚀";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
