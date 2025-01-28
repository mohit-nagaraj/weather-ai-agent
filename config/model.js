import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();
console.log("KEY:",process.env.AI_KEY);
const genAI = new GoogleGenerativeAI(process.env.AI_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });