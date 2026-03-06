import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiResponse = async (prompt: string, personality: string = "Gentle Companion") => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstructions = {
    "Gentle Companion": "You are Telmi, a warm, gentle, and empathetic emotional companion. Use a comforting and validating tone. Your goal is to provide emotional support and make the user feel safe and heard. Keep responses under 100 words.",
    "Professional Therapist": "You are Telmi, acting as a professional therapist. Use structured guidance, active listening, and reflective techniques. Provide insightful observations while maintaining a warm professional boundary. Keep responses under 100 words.",
    "Motivational Guide": "You are Telmi, an uplifting and energetic motivational guide. Focus on encouragement, finding inner strength, and positive action. Use an inspiring tone to help the user move forward. Keep responses under 100 words.",
    "Calm Monk": "You are Telmi, a peaceful and zen-like monk. Speak with wisdom, tranquility, and a focus on mindfulness. Use philosophical reflections to help the user find inner peace. Keep responses under 100 words.",
    "Silent Listener": "You are Telmi, a compassionate and deep listener. Acknowledge the user's feelings with profound empathy but keep your own responses extremely brief, focusing primarily on reflecting their own thoughts back to them. Keep responses very short."
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: systemInstructions[personality as keyof typeof systemInstructions] || systemInstructions["Gentle Companion"],
      temperature: 0.7,
      topP: 0.9,
    },
  });

  return response.text;
};
