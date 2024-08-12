import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_SECRET_KEY || "AIzaSyAb9-vH-Ff9smygvfX5_FVS36FRJyEGxIA"
);

export default async function* geminiPrompt(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  } catch (error) {
    console.log(error);
    yield "Error generating content";
  }
}
