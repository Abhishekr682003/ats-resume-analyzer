package com.ats.resumeanalyzer.service;

import com.ats.resumeanalyzer.model.AnalysisResult;
import com.ats.resumeanalyzer.model.Job;
import com.ats.resumeanalyzer.model.Resume;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalysisService {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public AnalysisResult analyzeResume(Resume resume, Job job) {
        try {
            List<String> resumeSkills = parseSkills(resume.getSkills());
            List<String> jobSkills = parseSkills(job.getRequiredSkills());
            
            // Calculate match percentage
            double matchPercentage = calculateMatchPercentage(resumeSkills, jobSkills);
            
            // Find matched and missing skills
            List<String> matchedSkills = resumeSkills.stream()
                    .filter(skill -> jobSkills.stream()
                            .anyMatch(jobSkill -> jobSkill.equalsIgnoreCase(skill)))
                    .collect(Collectors.toList());
            
            List<String> missingSkills = jobSkills.stream()
                    .filter(jobSkill -> resumeSkills.stream()
                            .noneMatch(skill -> skill.equalsIgnoreCase(jobSkill)))
                    .collect(Collectors.toList());
            
            // Generate skill suggestions
            List<String> skillSuggestions = generateSkillSuggestions(missingSkills, job);
            
            AnalysisResult result = new AnalysisResult();
            result.setMatchPercentage(Math.round(matchPercentage * 100.0) / 100.0);
            result.setMatchedSkills(matchedSkills);
            result.setMissingSkills(missingSkills);
            result.setSkillSuggestions(skillSuggestions);
            result.setResumeText(resume.getExtractedText());
            result.setJobTitle(job.getTitle());
            result.setResumeId(resume.getId());
            result.setJobId(job.getId());
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error analyzing resume: " + e.getMessage(), e);
        }
    }
    
    private List<String> parseSkills(String skillsJson) {
        try {
            if (skillsJson == null || skillsJson.trim().isEmpty() || skillsJson.equals("[]")) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(skillsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    private double calculateMatchPercentage(List<String> resumeSkills, List<String> jobSkills) {
        if (jobSkills.isEmpty()) {
            return 0.0;
        }
        
        if (resumeSkills.isEmpty()) {
            return 0.0;
        }
        
        long matchedCount = resumeSkills.stream()
                .mapToLong(resumeSkill -> jobSkills.stream()
                        .anyMatch(jobSkill -> jobSkill.equalsIgnoreCase(resumeSkill)) ? 1 : 0)
                .sum();
        
        return (double) matchedCount / jobSkills.size() * 100.0;
    }
    
    private List<String> generateSkillSuggestions(List<String> missingSkills, Job job) {
        List<String> suggestions = new ArrayList<>();
        
        for (String skill : missingSkills) {
            suggestions.add("Consider learning or improving: " + skill);
        }
        
        if (job.getMinExperience() != null && job.getMinExperience() > 0) {
            suggestions.add("Gain at least " + job.getMinExperience() + " years of relevant experience");
        }
        
        return suggestions;
    }
}
