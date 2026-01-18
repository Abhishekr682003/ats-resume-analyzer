package com.ats.resumeanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class JobRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String description;
    
    @NotBlank
    private List<String> requiredSkills;
    
    @NotBlank
    private String company;
    
    @NotBlank
    private String location;
    
    private Integer minExperience;
    
    private List<String> qualifications;
}
