const axios = require('axios');
const { GEMINI_API_KEY } = require('../../shared/config/constants');

class FeedbackService {
  async generateMatchFeedback(userProfile, matchedUserProfile, chatHistory) {
    try {
      // Mock feedback for demo purposes since Gemini API might not work in preview
      const mockFeedbacks = [
        {
          reason: "Communication styles didn't align",
          suggestion: "Consider being more open about your interests and asking follow-up questions to show genuine curiosity.",
          insight: "Your match seemed to prefer deeper conversations, while your responses were more surface-level."
        },
        {
          reason: "Different life goals and priorities",
          suggestion: "Be clearer about your long-term goals early in conversations to find better compatibility.",
          insight: "There was a mismatch in relationship expectations and future planning."
        },
        {
          reason: "Limited shared interests discovered",
          suggestion: "Try exploring new topics and be more curious about your match's hobbies and passions.",
          insight: "You both have unique interests that could complement each other with more exploration."
        },
        {
          reason: "Conversation flow felt forced",
          suggestion: "Focus on asking open-ended questions and sharing personal stories to create natural dialogue.",
          insight: "The conversation lacked spontaneity and genuine connection moments."
        }
      ];

      // Return random mock feedback
      const randomFeedback = mockFeedbacks[Math.floor(Math.random() * mockFeedbacks.length)];
      
      return {
        feedback: randomFeedback,
        timestamp: new Date(),
        type: 'unpin_analysis'
      };

    } catch (error) {
      console.error('Feedback generation error:', error);
      
      // Fallback feedback
      return {
        feedback: {
          reason: "Natural relationship progression",
          suggestion: "Every connection teaches us something. Take time to reflect on what you learned about yourself and what you're looking for.",
          insight: "This experience will help you build better connections in the future."
        },
        timestamp: new Date(),
        type: 'unpin_analysis'
      };
    }
  }

  async generateGeminiFeedback(userProfile, matchedUserProfile, chatHistory) {
    try {
      const prompt = `
        Analyze this dating interaction and provide constructive feedback:
        
        User Profile: ${JSON.stringify(userProfile)}
        Matched User Profile: ${JSON.stringify(matchedUserProfile)}
        Chat Messages: ${chatHistory.length} messages exchanged
        
        Please provide:
        1. A likely reason why the match was unpinned
        2. A constructive suggestion for improvement
        3. A personal insight for growth
        
        Keep the tone supportive and growth-oriented.
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      return {
        feedback: {
          reason: "AI-generated analysis",
          suggestion: generatedText,
          insight: "Based on conversation patterns and compatibility factors"
        },
        timestamp: new Date(),
        type: 'ai_analysis'
      };

    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FeedbackService();