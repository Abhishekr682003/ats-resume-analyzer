package com.ats.resumeanalyzer.controller;

import com.ats.resumeanalyzer.model.Resume;
import com.ats.resumeanalyzer.model.User;
import com.ats.resumeanalyzer.repository.ResumeRepository;
import com.ats.resumeanalyzer.repository.UserRepository;
import com.ats.resumeanalyzer.service.ResumeParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeController {
    
    private static final String UPLOAD_DIR = "uploads/resumes/";
    
    @Autowired
    private ResumeRepository resumeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ResumeParserService resumeParserService;
    
    static {
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName != null 
                    ? originalFileName.substring(originalFileName.lastIndexOf(".")) 
                    : "";
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = Paths.get(UPLOAD_DIR + uniqueFileName);
            
            Files.write(filePath, file.getBytes());
            
            String extractedText = resumeParserService.extractText(file);
            String skills = resumeParserService.extractSkills(extractedText);
            
            Resume resume = new Resume();
            resume.setFileName(originalFileName);
            resume.setFilePath(filePath.toString());
            resume.setExtractedText(extractedText);
            resume.setSkills(skills);
            resume.setUploadedAt(LocalDateTime.now());
            resume.setUser(user);
            
            resumeRepository.save(resume);
            
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error uploading file: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-resumes")
    public ResponseEntity<List<Resume>> getMyResumes(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Resume> resumes = resumeRepository.findByUserId(user.getId());
        return ResponseEntity.ok(resumes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Resume> getResume(@PathVariable Long id, Authentication authentication) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!resume.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(resume);
    }
}
