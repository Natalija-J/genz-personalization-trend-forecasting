import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category, TrendItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for the second step (Formatting)
const trendSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    trends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the trend" },
          description: { type: Type.STRING, description: "Brief description of the trend" },
          growthScore: { type: Type.INTEGER, description: "Predicted growth score from 0 to 100" },
          sentiment: { type: Type.STRING, description: "General sentiment: Positive, Neutral, or Mixed" },
          prediction: { type: Type.STRING, description: "Future outlook for this trend over the next 6-12 months" },
          marketStrategy: { type: Type.STRING, description: "Actionable marketing strategy for brands targeting Gen Z" },
          productIdea: { type: Type.STRING, description: "A specific product development concept leveraging this trend" },
          historicalData: {
            type: Type.ARRAY,
            description: "Simulated trend data points for the last 6 months for visualization",
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                value: { type: Type.INTEGER },
              }
            }
          }
        },
        required: ["name", "description", "growthScore", "sentiment", "prediction", "marketStrategy", "productIdea", "historicalData"],
      },
    },
  },
  required: ["trends"],
};

export const fetchTrends = async (category: Category): Promise<TrendItem[]> => {
  try {
    // Step 1: Gather Real-time Data using Google Search Grounding
    // We cannot use responseSchema with search tools, so we do this in two passes.
    // Pass 1: Get the raw information.
    const searchPrompt = `
      Act as a cool trend spotter for Gen Z.
      Search for the absolute latest, rising trends in ${category} for Gen Z right now (current year).
      Focus on viral aesthetics, emerging technologies, or lifestyle shifts.
      Look for specific items, styles, or behaviors that are gaining traction on TikTok, Instagram, or niche communities.
      Provide a detailed report.
    `;

    const searchResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        tools: [{ googleSearch: {} }],
      },
      contents: searchPrompt,
    });

    const searchData = searchResponse.text;
    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract sources to attach later
    const validSources = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((s: any) => s !== null);

    // Step 2: Structure the Data using JSON Schema
    // We feed the search result into a new prompt to get structured JSON.
    const analysisPrompt = `
      Analyze the following trend report on Gen Z ${category}:
      
      "${searchData}"

      Extract the top 4 distinct trends from this text.
      For each trend, predict its future trajectory, suggest a market strategy, and a product idea.
      Generate a simulated historical data array (last 6 months) showing its rise (values 0-100).
      Return ONLY JSON.
    `;

    const structuredResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: analysisPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: trendSchema,
      },
    });

    const jsonText = structuredResponse.text;
    if (!jsonText) throw new Error("Failed to generate JSON");

    const parsed = JSON.parse(jsonText);
    
    // Merge sources back (distribute them roughly or just attach global sources to the first item? 
    // Let's attach relevant sources if possible, but for simplicity, we'll attach the top 3 global sources to all for reference, 
    // or leave it to the UI to show "Global Sources").
    // Here we will just assign a unique ID and return.
    
    return parsed.trends.map((t: any, index: number) => ({
      ...t,
      id: `${category}-${index}-${Date.now()}`,
      category,
      sources: validSources.slice(0, 3), // Just attach top 3 sources to each for credibility context
    }));

  } catch (error) {
    console.error("Error fetching trends:", error);
    // Return empty or mock in case of critical failure to avoid white screen, but ideally we show error state in UI
    throw error;
  }
};