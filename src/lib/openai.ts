// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDrugExplanation(drugName: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that explains how drugs work based on their molecular structure. Provide clear, accurate explanations for a general audience."
      },
      {
        role: "user",
        content: `Explain how the drug ${drugName} works based on its molecular structure. Keep it under 150 words and focus on the mechanism of action.`
      }
    ],
  });

  return response.choices[0].message.content;
}

