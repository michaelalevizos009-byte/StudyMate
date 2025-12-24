import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Type, Chat } from '@google/genai';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI;
  private authService = inject(AuthService);

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  // --- Core Generation ---
  async generateStudyContent(
    content: string, 
    type: 'notes' | 'summary' | 'quiz' | 'explain' | 'comprehensive', 
    filePart?: { inlineData: { mimeType: string; data: string } },
    focus: 'general' | 'exam' | 'simplify' | 'deep' = 'general'
  ): Promise<string> {
    
    const isPro = this.authService.isPro();
    let modelName = 'gemini-2.5-flash-lite';
    let responseSchema = undefined;
    let responseMimeType = 'text/plain';

    if (isPro && (focus === 'deep' || type === 'comprehensive')) {
       modelName = 'gemini-2.5-flash'; 
    }

    let systemInstruction = "You are StudyMate AI, an expert academic tutor. Your goal is to simplify complex topics and help students ace their exams.";
    let prompt = "";

    let focusInstruction = "";
    switch (focus) {
      case 'exam': 
        focusInstruction = "CRITICAL FOCUS: High-yield facts, exam questions, and commonly tested concepts only. Ignore fluff."; 
        break;
      case 'simplify': 
        focusInstruction = "CRITICAL FOCUS: Use simple ELI5 language, clear analogies, and step-by-step logic. Grade 8 readability."; 
        break;
      case 'deep': 
        focusInstruction = "CRITICAL FOCUS: Explore theoretical underpinnings, connections to other fields, and advanced implications.";
        break;
      default: 
        focusInstruction = "CRITICAL FOCUS: Provide a balanced, structured, and comprehensive academic overview."; 
        break;
    }

    if (type === 'comprehensive') {
      systemInstruction += `
      perform a deep semantic analysis of the provided material.
      ${focusInstruction}
      **OUTPUT REQUIREMENTS:**
      Return strictly valid JSON.
      **STRUCTURE:**
      1. **Notes:** Hierarchical Markdown.
      2. **Summary:** 3 levels (short, balanced, detailed).
      3. **Quiz:** 8-10 questions.
      4. **Think Deep:** A section connecting ideas.
      5. **Flashcards:** 5-7 key concepts defined.
      6. **MindMap:** A root node with children (topics) and sub-children (details) for visualization.
      7. **Resources:** 3-5 high-quality external links.
      `;
      prompt = "Generate the Comprehensive Study Guide JSON.";
      responseMimeType = 'application/json';
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING },
          notes: { type: Type.STRING },
          summary: { 
            type: Type.OBJECT,
            properties: {
               short: { type: Type.STRING },
               balanced: { type: Type.STRING },
               detailed: { type: Type.STRING }
            },
            required: ["short", "balanced", "detailed"]
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["multiple_choice", "true_false", "matching", "short_answer"] },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["type", "question", "correctAnswer", "explanation"]
            }
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING },
                tag: { type: Type.STRING }
              },
              required: ["front", "back"]
            }
          },
          mindMap: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              children: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    children: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: { label: { type: Type.STRING } }
                      }
                    }
                  }
                }
              }
            }
          },
          thinkDeep: { type: Type.STRING },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['video', 'article', 'book'] }
              }
            }
          }
        },
        required: ["language", "notes", "summary", "quiz", "flashcards", "mindMap", "thinkDeep", "resources"]
      };

    } else {
       if (type === 'notes') prompt = `Create structured study notes. ${focusInstruction}`;
       if (type === 'summary') prompt = `Create an exam summary. ${focusInstruction}`;
       if (type === 'quiz') prompt = `Create 5 multiple choice questions with answers at the end. ${focusInstruction}`;
       if (type === 'explain') prompt = `Explain this concept clearly. ${focusInstruction}`;
    }

    try {
      const parts: any[] = [];
      if (filePart) parts.push(filePart);
      parts.push({ text: prompt + "\n\nMaterial:\n" + content });

      const config: any = { systemInstruction, responseMimeType };
      if (responseSchema) config.responseSchema = responseSchema;
      
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config
      });
      
      let text = response.text || "";
      if (responseMimeType === 'application/json') text = this.cleanJson(text);
      return text;

    } catch (error) {
      console.error("AI Gen Error", error);
      throw error;
    }
  }

  // --- Translation Capability ---
  async translateContent(content: string, targetLang: string): Promise<string> {
    const prompt = `Translate the following educational content into ${targetLang}. Maintain formatting (Markdown) and academic tone. Content: \n\n${content}`;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt
      });
      return response.text || content;
    } catch (e) {
      return content;
    }
  }

  // --- Planner AI ---
  async generateStudyPlan(subject: string, goal: string, events: any[]): Promise<string> {
    const eventList = events.map(e => `${e.title} (${e.time})`).join(', ');
    const prompt = `
      Create a 3-day study plan JSON.
      Subject: ${subject}
      Goal: ${goal}
      Avoid: ${eventList}
      Format: Array of { "day": string, "sessions": [{ "time": string, "title": string, "type": "study"|"break" }] }
      Rules: 45min study, 15min break. Start 9am, End 6pm.
    `;
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return this.cleanJson(response.text || '[]');
    } catch (e) {
      return '[]';
    }
  }

  // --- Note Enhancement AI ---
  async enhanceNotes(noteContent: string, action: 'fix' | 'summarize' | 'expand'): Promise<string> {
     let prompt = "";
     if (action === 'fix') prompt = "Correct grammar, improve clarity, and fix formatting.";
     if (action === 'summarize') prompt = "Summarize this note in 5 bullet points.";
     if (action === 'expand') prompt = "Expand on these concepts with examples and details.";

     const response = await this.ai.models.generateContent({
       model: 'gemini-2.5-flash-lite',
       contents: prompt + "\n\n" + noteContent
     });
     return response.text || noteContent;
  }
  
  // --- Content Moderation ---
  async moderateContent(text: string): Promise<{safe: boolean, reason?: string}> {
     try {
       const response = await this.ai.models.generateContent({
         model: 'gemini-2.5-flash-lite',
         contents: `
         Task: Content Safety Check
         Analyze the following student note for inappropriate content.
         Categories to flag: Hate speech, harassment, sexually explicit, dangerous content, PII.
         Output JSON: { "safe": boolean, "reason": string | null }
         Content: ${text.substring(0, 1000)}
         `,
         config: { responseMimeType: 'application/json' }
       });
       const result = JSON.parse(this.cleanJson(response.text || '{"safe":true}'));
       return result;
     } catch (e) {
       return { safe: true }; 
     }
  }

  // --- AI Study Coach (Premium) ---
  async getCoachTip(userName: string, mastery: Record<string, number>): Promise<string> {
     const subjects = Object.entries(mastery).map(([k,v]) => `${k}: ${v}%`).join(', ');
     const prompt = `
       You are a supportive, high-energy study coach.
       User: ${userName}.
       Current Mastery: ${subjects || 'Just starting out'}.
       Give a short, punchy (1-2 sentences) tip to motivate them.
     `;
     try {
       const response = await this.ai.models.generateContent({
         model: 'gemini-2.5-flash-lite',
         contents: prompt
       });
       return response.text || "Keep pushing forward! Consistency is the key to mastery. 🚀";
     } catch (e) {
       return "Review your weakest topics today to boost your confidence! 💪";
     }
  }

  // --- Music Recommendation (Spotify Integration) ---
  async recommendMusicGenre(topic: string): Promise<string> {
     // Lightweight check to save tokens, fall back to AI for complex queries
     const topicLower = topic.toLowerCase();
     if (topicLower.includes('math') || topicLower.includes('logic')) return 'Classical';
     if (topicLower.includes('read') || topicLower.includes('lit')) return 'Lo-Fi';
     if (topicLower.includes('code') || topicLower.includes('tech')) return 'Synthwave';
     if (topicLower.includes('workout') || topicLower.includes('gym')) return 'High Energy';

     // If uncertain, ask AI
     try {
       const response = await this.ai.models.generateContent({
         model: 'gemini-2.5-flash-lite',
         contents: `Suggest a single music genre (e.g. Lo-Fi, Classical, Ambient, Jazz, Rock) for studying this topic: "${topic}". Return only the genre name.`
       });
       return response.text?.trim() || 'Focus';
     } catch (e) {
       return 'Focus';
     }
  }

  // --- Chat ---
  startStudyChat(contextMaterial: string): Chat {
    return this.ai.chats.create({
      model: 'gemini-2.5-flash-lite',
      config: {
        systemInstruction: `You are StudyMate Tutor. Context: ${contextMaterial}. Be helpful, concise, and encouraging.`
      }
    });
  }

  private cleanJson(text: string): string {
    if (!text) return "{}";
    const start = text.indexOf('{') > -1 && text.indexOf('[') > -1 
        ? Math.min(text.indexOf('{'), text.indexOf('[')) 
        : Math.max(text.indexOf('{'), text.indexOf('['));
    const end = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
    if (start > -1 && end > start) return text.substring(start, end + 1);
    return text;
  }
}