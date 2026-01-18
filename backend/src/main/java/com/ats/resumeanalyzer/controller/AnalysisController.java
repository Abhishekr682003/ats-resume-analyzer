package com.ats.resumeanalyzer.controller;

import com.ats.resumeanalyzer.model.AnalysisResult;
import com.ats.resumeanalyzer.model.Job;
import com.ats.resumeanalyzer.model.Resume;
import com.ats.resumeanalyzer.model.User;
import com.ats.resumeanalyzer.repository.JobRepository;
import com.ats.resumeanalyzer.repository.ResumeRepository;
import com.ats.resumeanalyzer.repository.UserRepository;
import com.ats.resumeanalyzer.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalysisController {
    
    @Autowired
    private AnalysisService analysisService;
    
    @Autowired
    private ResumeRepository resumeRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyzeResume(
            @RequestParam Long resumeId,
            @RequestParam Long jobId,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Resume resume = resumeRepository.findById(resumeId)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            
            if (!resume.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            
            AnalysisResult result = analysisService.analyzeResume(resume, job);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
