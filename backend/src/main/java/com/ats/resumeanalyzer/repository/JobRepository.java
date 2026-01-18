package com.ats.resumeanalyzer.repository;

import com.ats.resumeanalyzer.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsActiveTrue();
}
