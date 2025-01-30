import { model } from "../config/model.js";
import { SYSTEM_PROMPT } from "../util/contants.js";
import { getWeatherDetails } from "../util/weatherInfo.js";

export const promptProcessor = async (req, res) => {
    const { prompt } = req.body;
    let conversation = [
        {
            role: 'model',
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

            console.log('Step:', JSON.stringify(step));
            
            switch (step.type) {
                case 'output':
                    return res.json({ result: step });
                    
                case 'action':
                    if (step.function === 'getWeatherDetails') {
                        const weatherData = await getWeatherDetails(step.input);
                        console.log('Weather Data:', JSON.stringify(weatherData.current.temp_c));
                        const observation = {
                            type: 'observation',
                            observation: weatherData.current.temp_c
                        };
                        conversation.push({
                            role: 'model',
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