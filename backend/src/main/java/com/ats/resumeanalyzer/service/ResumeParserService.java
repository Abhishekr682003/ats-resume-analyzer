package com.ats.resumeanalyzer.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeParserService {

    public String extractText(MultipartFile file) throws Exception {
        String fileName = file.getOriginalFilename();

        if (fileName == null || !fileName.contains(".")) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

        return switch (extension) {
            case "pdf" -> extractTextFromPDF(file);
            case "docx" -> extractTextFromDOCX(file);
            default -> throw new UnsupportedOperationException(
                    "Unsupported file format. Please upload PDF or DOCX only."
            );
        };
    }

    // ✅ FIXED: PDFBox 3.x compatible
    private String extractTextFromPDF(MultipartFile file) throws Exception {
        byte[] pdfBytes = file.getBytes(); // ✔ correct way

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDOCX(MultipartFile file) throws Exception {
        try (XWPFDocument document = new XWPFDocument(file.getInputStream());
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {

            return extractor.getText();
        }
    }

    public String extractSkills(String text) {
        String[] skillKeywords = {
                "Java", "Python", "JavaScript", "React", "Angular", "Vue", "Node.js",
                "Spring Boot", "Django", "Flask", "Express", "SQL", "MySQL", "PostgreSQL",
                "MongoDB", "AWS", "Azure", "Docker", "Kubernetes", "Git", "GitHub",
                "HTML", "CSS", "Bootstrap", "TypeScript", "REST API", "GraphQL",
                "Machine Learning", "Data Science", "TensorFlow", "PyTorch",
                "C++", "C#", ".NET", "PHP", "Ruby", "Go", "Rust",
                "Agile", "Scrum", "DevOps", "CI/CD", "Jenkins", "Jira"
        };

        StringBuilder foundSkills = new StringBuilder("[");
        boolean first = true;
        String lowerText = text.toLowerCase();

        for (String skill : skillKeywords) {
            if (lowerText.contains(skill.toLowerCase())) {
                if (!first) {
                    foundSkills.append(",");
                }
                foundSkills.append("\"").append(skill).append("\"");
                first = false;
            }
        }

        foundSkills.append("]");
        return foundSkills.toString();
    }
}
