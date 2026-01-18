package com.ats.resumeanalyzer.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "LONGTEXT")
    private String requiredSkills; // JSON array of skills
    
    @Column(nullable = false)
    private String company;
    
    @Column(nullable = false)
    private String location;
    
    @Column
    private Integer minExperience;
    
    @Column
    private String qualifications; // JSON array of qualifications
    
    @Column(nullable = false)
    private LocalDateTime postedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by")
    private User postedBy;
    
    @Column(nullable = false)
    private Boolean isActive = true;
}
