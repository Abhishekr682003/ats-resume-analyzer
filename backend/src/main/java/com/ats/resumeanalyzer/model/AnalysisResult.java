package com.ats.resumeanalyzer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResult {
    private Double matchPercentage;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> skillSuggestions;
    private String resumeText;
    private String jobTitle;
    private Long resumeId;
    private Long jobId;
}
