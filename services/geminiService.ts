
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { getGeminiApiKey, loadAppConfig } from "../appConfig";

const template = (input: string, vars: Record<string, string>) =>
  input.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key) => (key in vars ? vars[key] : ''));

/**
 * Handles the main chat functionality using Gemini Pro for deep reasoning.
 */
export const callArcaneCore = async (prompt: string, history: { role: string; parts: { text: string }[] }[]): Promise<string> => {
  const cfg = loadAppConfig();
  const apiKey = getGeminiApiKey(cfg);
  if (!apiKey) return "AUTH_REQUIRED";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: cfg.ai.chat.model || 'gemini-3-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: cfg.ai.chat.systemInstruction,
        temperature: cfg.ai.chat.temperature,
      },
    });
    return response.text || "The magical connection wavered. Please try again.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Return standard error string for App.tsx to catch
    if (error?.message?.includes("Requested entity was not found")) {
      return "AUTH_REQUIRED";
    }
    return "The mystical threads are tangled. Connection interrupted.";
  }
};

/**
 * Handles fast, curriculum-aligned lesson weaving using Gemini 3 Flash.
 */
export const weaveDream = async (subject: string, era: string, domain: string): Promise<string> => {
  const cfg = loadAppConfig();
  const apiKey = getGeminiApiKey(cfg);
  if (!apiKey) return "AUTH_REQUIRED";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const systemInstruction = template(cfg.ai.dream.systemInstruction, { subject, era, domain });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: cfg.ai.dream.model || 'gemini-3-flash-preview',
      contents: `Weave a lesson for ${era} in the domain of ${domain}. Specific interest: ${subject}`,
      config: {
        systemInstruction,
        temperature: cfg.ai.dream.temperature,
      },
    });
    return response.text || "The vision is clouded.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error?.message?.includes("Requested entity was not found")) {
      return "AUTH_REQUIRED";
    }
    return "The mystical essence failed to manifest.";
  }
};
