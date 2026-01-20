import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export const aiService = {
  async generate(prompt, opts = {}) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return {
                text: "AI not configured: Set GEMINI_API_KEY in server .env"
            };
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return { text: response.text() };
    } catch (err) {
        console.error("AI Service Error:", err);
        return { text: "Failed to generate response. Please try again." };
    }
  },
  
  async generateJSON(prompt) {
      // Wrapper to force valid JSON if possible (simplistic approach)
      try {
          const fullPrompt = `${prompt} \n\n Respond ONLY with valid JSON.`;
          const res = await this.generate(fullPrompt);
          // Try to clean markdown code blocks often returned by LLMs
          let clean = res.text.replace(/```json/g, "").replace(/```/g, "");
          return JSON.parse(clean);
      } catch (err) {
          console.error("AI JSON Parse Error:", err);
          return null;
      }
  }
};
