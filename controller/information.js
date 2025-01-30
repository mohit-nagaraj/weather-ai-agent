import { model } from "../config/model.js";
import { SYSTEM_PROMPT } from "../util/contants.js";

export const promptProcessor = async (req, res) => {
    const { prompt } = req.body;
    let conversation = [
        {
            role: 'mpdel',
            parts: [{ text: SYSTEM_PROMPT }]
        },
        {
            role: 'user',
            parts: [{ text: prompt }]
        }
    ];
    
    try {
        while (true) {
            const result = await model.generateContent({ contents: conversation });
            const responseText = result.response.candidates[0].content.parts[0].text;
            const step = JSON.parse(responseText);
            
            // Add AI's response to conversation
            conversation.push({
                role: 'model',
                parts: [{ text: JSON.stringify(step) }]
            });
            
            switch (step.type) {
                case 'output':
                    return res.json({ result: step });
                    
                case 'action':
                    if (step.function === 'getWeatherDetails') {
                        const weatherData = await getWeatherDetails(step.input);
                        const observation = {
                            type: 'observation',
                            observation: JSON.parse(weatherData).temperature
                        };
                        conversation.push({
                            role: 'user',
                            parts: [{ text: JSON.stringify(observation) }]
                        });
                    }
                    break;
                    
                case 'plan':
                    break;
                    
                default:
                    throw new Error(`Unknown step type: ${step.type}`);
            }
        }
    } catch (error) {
        console.error('Prompt Processing Error:', error);
        return res.status(500).json({ 
            error: 'Failed to process prompt',
            details: error.message 
        });
    }
};