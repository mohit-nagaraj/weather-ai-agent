import { model } from "../config/model.js";
import { SYSTEM_PROMPT } from "../util/contants.js";

export const promptProcessor = async (req, res) => {
    const { prompt } = req.body;
    
    try {
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ]
        });

        return res.json({ result: result.response });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ 
            error: 'Failed to generate content',
            details: error.message 
        });
    }
};