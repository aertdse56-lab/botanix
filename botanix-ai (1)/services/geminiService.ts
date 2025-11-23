
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlantIdentification, Language, ChatMessage, ToolResult } from "../types";

// Expanded schema for professional output
const plantSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    scientificName: { type: Type.STRING, description: "Scientific Latin name" },
    commonNames: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of common names in the requested language"
    },
    confidence: { 
      type: Type.NUMBER, 
      description: "Confidence score between 0 and 100" 
    },
    description: { type: Type.STRING, description: "A simple, easy-to-understand description of the plant." },
    benefits: { 
      type: Type.STRING, 
      description: "Health benefits for the human body (digestion, skin, immunity) or environmental benefits." 
    },
    reasoning: { type: Type.STRING, description: "Identification reasoning" },
    taxonomy: {
      type: Type.OBJECT,
      properties: {
        genus: { type: Type.STRING },
        family: { type: Type.STRING },
        order: { type: Type.STRING }
      }
    },
    morphology: {
      type: Type.OBJECT,
      properties: {
        leaves: { type: Type.STRING },
        flowers: { type: Type.STRING },
        fruits: { type: Type.STRING },
        stems: { type: Type.STRING },
        roots: { type: Type.STRING },
        nectar: { type: Type.STRING }
      }
    },
    care: {
      type: Type.OBJECT,
      properties: {
        waterAmount: { type: Type.STRING, description: "Exact water amount in ml (e.g., '250ml') based on estimated pot size." },
        waterFrequency: { type: Type.STRING, description: "Specific frequency (e.g., 'Every 4-5 days')." },
        sunlightLux: { type: Type.STRING, description: "Ideal lux range or descriptive light level." },
        soilMix: { type: Type.STRING, description: "Optimal soil composition." },
        potSizeAnalysis: { type: Type.STRING, description: "Analyze if the current pot looks too small, too big, or correct from the image." },
        fertilizerSchedule: { type: Type.STRING },
        pruning: { type: Type.STRING },
        temperature: { type: Type.STRING, description: "Ideal temperature range." }
      }
    },
    ecology: {
      type: Type.OBJECT,
      properties: {
        nativeRegion: { type: Type.STRING },
        habitat: { type: Type.STRING },
        role: { type: Type.STRING },
        companions: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    safety: {
      type: Type.OBJECT,
      properties: {
        isPoisonous: { type: Type.BOOLEAN },
        poisonDetails: { type: Type.STRING },
        consumption: { type: Type.STRING, description: "Edibility, taste, or toxicity symptoms." },
        isInvasive: { type: Type.BOOLEAN },
        isEndangered: { type: Type.BOOLEAN },
        isMedicinal: { type: Type.BOOLEAN },
        medicinalUses: { type: Type.STRING },
        notes: { type: Type.STRING }
      }
    },
    diagnostics: {
      type: Type.OBJECT,
      properties: {
        status: { 
          type: Type.STRING, 
          enum: ["Healthy", "Diseased", "Pest Infested", "Nutrient Deficient", "Unknown"]
        },
        details: { type: Type.STRING, description: "Visible signs of disease, pests, or deficiency." },
        treatment: { type: Type.STRING, description: "Organic treatment steps." },
        prevention: { type: Type.STRING }
      }
    },
    healthScore: { type: Type.NUMBER, description: "0-100 score based on visual health (greenness, perkiness)." },
    personality: { type: Type.STRING, description: "A fun personality archetype for this plant (e.g., 'The Drama Queen', 'The Survivor', 'Chill Buddy')." },
    lifespanPrediction: { type: Type.STRING, description: "Prediction of survival likelihood for next 30 days based on current health." },
    rescuePlan: {
      type: Type.OBJECT,
      properties: {
        isNeeded: { type: Type.BOOLEAN },
        step1: { type: Type.STRING, description: "Day 1 Rescue Task" },
        step2: { type: Type.STRING, description: "Day 2 Rescue Task" },
        step3: { type: Type.STRING, description: "Day 3 Rescue Task" }
      }
    },
    folklore: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING },
        stories: { type: Type.STRING }
      }
    },
    similarSpecies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          difference: { type: Type.STRING }
        }
      }
    }
  },
  required: ["scientificName", "commonNames", "confidence", "description", "care", "safety", "diagnostics", "healthScore", "personality"]
};

const toolSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "0-100 score relevant to the tool (e.g. Drainage Score, Risk Score). Return -1 if N/A." },
    status: { type: Type.STRING, description: "Short status (e.g. 'Excellent', 'Critical', 'High Risk')" },
    analysis: { type: Type.STRING, description: "Detailed analysis of the visual evidence." },
    actionPlan: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 specific actionable steps." },
    prediction: { type: Type.STRING, description: "Future prediction (e.g. 'Will root in 2 weeks')." }
  },
  required: ["status", "analysis", "actionPlan"]
};

const getAI = () => {
  if (!process.env.API_KEY) throw new Error("API Key is missing.");
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const identifyPlant = async (base64Image: string, language: Language = 'en'): Promise<PlantIdentification> => {
  const ai = getAI();

  const langInstruction = language === 'bn' 
    ? "Output ALL textual descriptions in BENGALI (Bangla script). Keep it SIMPLE." 
    : "Output in English. Use simple, beginner-friendly language.";

  const systemInstruction = `
    You are Botanix, an expert AI Botanist and Phytopathologist.
    ${langInstruction}
    
    ANALYZE THE IMAGE FOR:
    1. Identification (Species)
    2. Health Score (0-100): Be critical. Brown spots = low score. Wilting = low score.
    3. Pot Size: Look at the ratio of plant to pot. Is it root bound?
    4. Water Needs: Estimate exact ml based on plant size/type (e.g. "200ml").
    5. Personality: Give it a fun "character" based on its known behavior (e.g. Fittonias are dramatic when dry).
    
    If health < 60, fill the 'rescuePlan' with a 3-day emergency guide.
    
    Strictly follow JSON schema.
  `;

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: plantSchema,
        temperature: 0.4,
        thinkingConfig: { thinkingBudget: 0 }
      },
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: "Identify this plant, analyze its health score (0-100), assign a personality, and prescribe precise care." }
        ]
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];
    else text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);

    return {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      imageUrl: base64Image,
      language: language,
      updates: [],
      chatHistory: [],
      toolHistory: []
    };

  } catch (error) {
    console.error("Plant identification failed:", error);
    throw error;
  }
};

export const getBotanistChatResponse = async (
  plantData: PlantIdentification, 
  history: ChatMessage[], 
  newMessage: string,
  language: Language
): Promise<string> => {
  const ai = getAI();
  const context = `
    You are a friendly expert Botanist discussing a specific plant with a user.
    PLANT: ${plantData.commonNames[0]}
    HEALTH SCORE: ${plantData.healthScore}/100
    PERSONALITY: ${plantData.personality}
    CARE: Water ${plantData.care.waterAmount} ${plantData.care.waterFrequency}.
    
    USER QUESTION: "${newMessage}"
    
    Respond in ${language === 'bn' ? 'Bengali' : 'English'}. Be helpful and reference the specific plant's health.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
        systemInstruction: "You are a helpful plant expert assistant.",
        thinkingConfig: { thinkingBudget: 0 }
    },
    contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: context }] }
    ]
  });

  return response.text || "I couldn't understand that. Could you rephrase?";
};

export const analyzeGrowth = async (
  oldImage: string, 
  newImage: string,
  language: Language
): Promise<{ analysis: string; status: string }> => {
  const ai = getAI();
  const cleanOld = oldImage.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");
  const cleanNew = newImage.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  const prompt = `
    Compare these two images of the SAME plant. Image 1 is past, Image 2 is present.
    Analyze growth, health changes, and predict next milestone.
    Output JSON: { "analysis": "text", "status": "Improving/Declining" }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: { responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } },
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: cleanOld } },
        { inlineData: { mimeType: "image/jpeg", data: cleanNew } },
        { text: prompt }
      ]
    }
  });

  const text = response.text || "{}";
  try {
      return JSON.parse(text);
  } catch (e) {
      return { analysis: "Could not analyze growth.", status: "Unknown" };
  }
};

export const analyzeToolImage = async (
  base64Image: string,
  toolName: string,
  systemInstruction: string,
  language: Language
): Promise<ToolResult> => {
  const ai = getAI();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  const langPrompt = language === 'bn' ? "Output in Bengali." : "Output in English.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `${systemInstruction} ${langPrompt}`,
        responseMimeType: "application/json",
        responseSchema: toolSchema,
        thinkingConfig: { thinkingBudget: 0 }
      },
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: "Analyze this image according to your expert persona." }
        ]
      }
    });

    const text = response.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const data = JSON.parse(jsonStr);

    return {
      ...data,
      toolId: crypto.randomUUID(),
      timestamp: Date.now(),
      imageUrl: base64Image,
      title: toolName
    };

  } catch (e) {
    console.error("Tool analysis failed", e);
    throw e;
  }
};
