import { model } from "../config/model.js";

export const promptProcessor= async(req, res) =>{
    
        const { prompt } = req.body;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return res.json({ result: result.response.text() });
    
}