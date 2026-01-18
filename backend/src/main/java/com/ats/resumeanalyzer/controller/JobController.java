package com.ats.resumeanalyzer.controller;

import com.ats.resumeanalyzer.dto.JobRequest;
import com.ats.resumeanalyzer.model.Job;
import com.ats.resumeanalyzer.model.User;
import com.ats.resumeanalyzer.repository.JobRepository;
import com.ats.resumeanalyzer.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @GetMapping
    public ResponseEntity<List<Job>> getAllActiveJobs() {
        List<Job> jobs = jobRepository.findByIsActiveTrue();
        return ResponseEntity.ok(jobs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return ResponseEntity.ok(job);
    }
    
    @PostMapping
    public ResponseEntity<Job> createJob(
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!user.getRole().name().equals("RECRUITER") && !user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(403).build();
            }
            
            Job job = new Job();
            job.setTitle(request.getTitle());
            job.setDescription(request.getDescription());
            job.setRequiredSkills(objectMapper.writeValueAsString(request.getRequiredSkills()));
            job.setCompany(request.getCompany());
            job.setLocation(request.getLocation());
            job.setMinExperience(request.getMinExperience());
            if (request.getQualifications() != null) {
                job.setQualifications(objectMapper.writeValueAsString(request.getQualifications()));
            }
            job.setPostedAt(LocalDateTime.now());
            job.setPostedBy(user);
            job.setIsActive(true);
            
            jobRepository.save(job);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            
            if (!user.getRole().name().equals("ADMIN") && 
                !job.getPostedBy().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            job.setTitle(request.getTitle());
            job.setDescription(request.getDescription());
            job.setRequiredSkills(objectMapper.writeValueAsString(request.getRequiredSkills()));
            job.setCompany(request.getCompany());
            job.setLocation(request.getLocation());
            job.setMinExperience(request.getMinExperience());
            if (request.getQualifications() != null) {
                job.setQualifications(objectMapper.writeValueAsString(request.getQualifications()));
            }
            
            jobRepository.save(job);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Job job = jobRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Job not found"));
            
            if (!user.getRole().name().equals("ADMIN") && 
                !job.getPostedBy().getId().equals(user.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            job.setIsActive(false);
            jobRepository.save(job);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
