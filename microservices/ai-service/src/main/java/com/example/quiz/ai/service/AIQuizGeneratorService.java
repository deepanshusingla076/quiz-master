package com.example.quiz.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIQuizGeneratorService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    /**
     * Generates a quiz using the Gemini API
     * 
     * @param subject The subject for the questions
     * @param difficulty The difficulty level
     * @param numberOfQuestions The number of questions to generate
     * @return A Map containing the generated quiz data
     */
    public Map<String, Object> generateQuiz(String subject, String difficulty, int numberOfQuestions) {
        try {
            // Create the prompt for Gemini API
            String prompt = createPrompt(subject, difficulty, numberOfQuestions);
            
            // Call Gemini API
            String response = callGeminiAPI(prompt);
            
            // Parse the response
            return parseResponse(response, subject, difficulty);
        } catch (Exception e) {
            log.error("Error generating quiz", e);
            throw new RuntimeException("Failed to generate quiz using AI", e);
        }
    }

    private String createPrompt(String subject, String difficulty, int numberOfQuestions) {
        return String.format(
            "Generate %d multiple-choice questions about %s with %s difficulty. " +
            "Return ONLY a valid JSON array without any markdown formatting or code blocks. " +
            "Each question should have exactly 4 options with only one correct answer. " +
            "Use this exact format: " +
            "[{\"question\": \"Question text here?\", \"options\": [" +
            "{\"text\": \"Option A\", \"correct\": true}, " +
            "{\"text\": \"Option B\", \"correct\": false}, " +
            "{\"text\": \"Option C\", \"correct\": false}, " +
            "{\"text\": \"Option D\", \"correct\": false}]}]. " +
            "Do not include any explanations, just the JSON array.",
            numberOfQuestions, subject, difficulty
        );
    }

    private String callGeminiAPI(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new RuntimeException("Gemini API key is not configured. Please set gemini.api.key in application.yml");
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        Map<String, Object> parts = new HashMap<>();
        
        parts.put("text", prompt);
        contents.put("parts", List.of(parts));
        requestBody.put("contents", List.of(contents));
        requestBody.put("generationConfig", Map.of(
            "temperature", 0.7,
            "topK", 40,
            "topP", 0.95,
            "maxOutputTokens", 1024
        ));
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        String url = apiUrl + "?key=" + apiKey;
        String response = restTemplate.postForObject(url, entity, String.class);
        
        try {
            JsonNode responseJson = objectMapper.readTree(response);
            return responseJson.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
        } catch (Exception e) {
            log.error("Error parsing Gemini API response", e);
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }

    private Map<String, Object> parseResponse(String response, String subject, String difficulty) {
        try {
            // Clean the response - remove markdown code blocks if present
            String cleanedResponse = cleanJsonResponse(response);
            log.debug("Cleaned response: {}", cleanedResponse);
            
            // Parse the JSON response
            JsonNode questionsArray = objectMapper.readTree(cleanedResponse);
            List<Map<String, Object>> questions = new ArrayList<>();
            
            for (JsonNode questionNode : questionsArray) {
                Map<String, Object> question = new HashMap<>();
                question.put("text", questionNode.path("question").asText());
                
                List<Map<String, Object>> options = new ArrayList<>();
                for (JsonNode optionNode : questionNode.path("options")) {
                    Map<String, Object> option = new HashMap<>();
                    option.put("text", optionNode.path("text").asText());
                    option.put("correct", optionNode.path("correct").asBoolean());
                    options.add(option);
                }
                
                question.put("options", options);
                questions.add(question);
            }
            
            // Return the response in the format expected by the frontend
            Map<String, Object> result = new HashMap<>();
            result.put("subject", subject);
            result.put("difficulty", difficulty);
            result.put("questions", questions);
            
            return result;
        } catch (Exception e) {
            log.error("Error parsing AI response", e);
            throw new RuntimeException("Failed to parse AI-generated questions", e);
        }
    }

    /**
     * Cleans the JSON response by removing markdown code blocks and other formatting
     */
    private String cleanJsonResponse(String response) {
        if (response == null || response.trim().isEmpty()) {
            return response;
        }
        
        String cleaned = response.trim();
        
        // Remove markdown code blocks (```json ... ``` or ``` ... ```)
        if (cleaned.startsWith("```")) {
            int firstNewline = cleaned.indexOf('\n');
            if (firstNewline != -1) {
                cleaned = cleaned.substring(firstNewline + 1);
            }
        }
        
        if (cleaned.endsWith("```")) {
            int lastBackticks = cleaned.lastIndexOf("```");
            if (lastBackticks != -1) {
                cleaned = cleaned.substring(0, lastBackticks);
            }
        }
        
        // Remove any leading/trailing whitespace
        cleaned = cleaned.trim();
        
        // If the response doesn't start with [ or {, try to find the JSON part
        if (!cleaned.startsWith("[") && !cleaned.startsWith("{")) {
            int jsonStart = Math.max(cleaned.indexOf('['), cleaned.indexOf('{'));
            if (jsonStart != -1) {
                cleaned = cleaned.substring(jsonStart);
            }
        }
        
        return cleaned;
    }
}