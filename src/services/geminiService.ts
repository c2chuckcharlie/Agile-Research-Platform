import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateResearchContent(prompt: string, language: 'zh' | 'en') {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `You are an expert academic research coach and Agile Scrum facilitator. 
        Your goal is to help doctoral students write high-quality research papers.
        Always respond in ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.
        Use a professional, academic, yet encouraging tone.
        Format your output using Markdown for better readability.`,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
