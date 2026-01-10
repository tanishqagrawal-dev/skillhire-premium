
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

class GeminiService {
    constructor() {
        // Use Global Config Key
        this.apiKey = (typeof geminiConfig !== 'undefined' && geminiConfig.apiKey)
            ? geminiConfig.apiKey
            : localStorage.getItem('GEMINI_API_KEY');
    }

    hasApiKey() {
        return !!this.apiKey;
    }

    async generateResponse(history, context) {
        if (!this.hasApiKey()) {
            throw new Error("API Key missing");
        }

        const systemMessage = {
            role: "user",
            parts: [{
                text: `
                SYSTEM INSTRUCTIONS:
                You are SKiL MATRiX's AI Career Coach. 
                
                Current Context:
                ${JSON.stringify(context)}

                Tone: Professional, Encouraging, Concise.
                Guidelines:
                1. If solving DSA, provide hints only.
                2. If reviewing resume, be constructive.
                3. Keep responses under 200 words.
                4. Use Markdown.
            `}]
        };

        const modelMessage = {
            role: "model",
            parts: [{ text: "Understood. I am ready to help." }]
        }

        const contents = [
            systemMessage,
            modelMessage,
            ...history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }))
        ];

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Failed to fetch response");
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error("Gemini Service Error:", error);
            throw error;
        }
    }
}

window.geminiService = new GeminiService();
