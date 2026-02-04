const fs = require('fs');
const mammoth = require('mammoth');

// Lazy load pdf-parse only when needed (fixes Vercel serverless issues)
const extractTextFromPDF = async (filePath) => {
    try {
        // Only require pdf-parse when actually parsing a PDF
        const { PDFParse } = require('pdf-parse');
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        await parser.destroy();
        return result.text;
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to parse PDF file');
    }
};

const extractTextFromDOCX = async (filePath) => {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
};

const extractSkills = (text) => {
    const skillKeywords = [
        "Java", "Python", "JavaScript", "React", "Angular", "Vue", "Node.js",
        "Spring Boot", "Django", "Flask", "Express", "SQL", "MySQL", "PostgreSQL",
        "MongoDB", "AWS", "Azure", "Docker", "Kubernetes", "Git", "GitHub",
        "HTML", "CSS", "Bootstrap", "TypeScript", "REST API", "GraphQL",
        "Machine Learning", "Data Science", "TensorFlow", "PyTorch",
        "C++", "C#", ".NET", "PHP", "Ruby", "Go", "Rust",
        "Agile", "Scrum", "DevOps", "CI/CD", "Jenkins", "Jira"
    ];

    const foundSkills = [];
    const lowerText = text.toLowerCase();

    skillKeywords.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            foundSkills.push(skill);
        }
    });

    return foundSkills;
};

module.exports = {
    extractTextFromPDF,
    extractTextFromDOCX,
    extractSkills
};
