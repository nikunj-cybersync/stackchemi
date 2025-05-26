// lib/models.ts - Free AI model alternatives using Google's Gemini
// Note: You'll need to install this package:
// npm install @google/genai

import { GoogleGenAI } from "@google/genai";

console.log("gemini api key", process.env.GOOGLE_AI_API_KEY);
// Initialize Gemini API
const genAI = process.env.GOOGLE_AI_API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY })
  : null;

// Primary function using Gemini
export async function generateWithGemini(drugName: string) {
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const prompt = `You are a helpful assistant that explains how drugs work based on their molecular structure. 
    Provide a clear, accurate explanation for a general audience about how the drug ${drugName} works.
    Focus on the mechanism of action and keep it under 150 words.`;

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini API");
    }

    return response.text;
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return getLocalFallback(drugName);
  }
}

// New function to analyze drug interactions using Gemini
export async function analyzeDrugInteraction(drugNames: string[]) {
  if (!genAI) {
    return getLocalInteractionData(drugNames);
  }

  if (drugNames.length < 2) {
    return {
      summary: "Please provide at least two drugs to analyze interactions.",
      interactions: [],
      severity: "none",
      recommendation: "No analysis possible with fewer than two drugs."
    };
  }

  try {
    const drugsList = drugNames.join(", ");
    
    const prompt = `You are a pharmaceutical expert analyzing potential drug interactions. 
    Please analyze the potential interactions between these drugs: ${drugsList}.
    
    For your response, follow this exact format without deviations:
    
    First, provide a 2-3 sentence summary of the overall interaction profile.
    
    Then, for each possible pair of drugs, provide:
    1. The specific interaction (if any)
    2. The mechanism behind the interaction
    3. Severity (Mild, Moderate, Severe)
    4. Recommendation for patients
    
    Finally, summarize with one key recommendation.
    
    Format your response as a JSON object with the following structure:
    {
      "summary": "Overall summary of interactions",
      "interactions": [
        {
          "drugs": ["Drug A", "Drug B"],
          "effect": "Description of interaction effect",
          "mechanism": "How the interaction occurs",
          "severity": "Mild/Moderate/Severe",
          "recommendation": "What patients should do"
        }
      ],
      "severity": "highest severity level found",
      "recommendation": "Overall recommendation"
    }`;

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 800,
        temperature: 0.3,
      },
    });
    
    // Try to parse the response as JSON
    try {
      // Find the JSON object in the response
      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        console.log("jsonStr", jsonStr);
        return JSON.parse(jsonStr);
      }
    } catch (parseError) {
      console.error("Error parsing JSON from response:", parseError);
    }
    
    // Fallback to default structure if parsing fails
    return {
      summary: "The AI model provided analysis but in an unexpected format. Here's the raw response:",
      interactions: [],
      severity: "unknown",
      recommendation: (response.text || "No response").substring(0, 500) + "..."
    };
  } catch (error) {
    console.error("Error with drug interaction analysis:", error);
    return getLocalInteractionData(drugNames);
  }
}

// Option 2: Ollama (completely free, runs locally)
// Requires Ollama installed: https://ollama.ai/
export async function generateWithOllama(drugName: string) {
  try {
    // Assumes Ollama is running locally on standard port
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama2', // or 'mistral' or other models you've pulled
        prompt: `You are a helpful assistant that explains how drugs work based on their molecular structure. 
        Provide a clear, accurate explanation for a general audience about how the drug ${drugName} works.
        Focus on the mechanism of action and keep it under 150 words.`,
        stream: false
      }),
    });
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error with Ollama API:", error);
    return getLocalFallback(drugName);
  }
}

// Option 3: No AI - Local fallback with curated responses
const knownDrugs: Record<string, string> = {
  "aspirin": "Aspirin (acetylsalicylic acid) works primarily by inhibiting cyclooxygenase (COX) enzymes, which are responsible for producing prostaglandins that promote inflammation, pain, and fever. By blocking COX enzymes, aspirin reduces prostaglandin production, resulting in its anti-inflammatory, analgesic, and antipyretic effects. At low doses, aspirin also inhibits platelet aggregation by preventing thromboxane A2 production, making it useful for preventing heart attacks and strokes.",
  
  "ibuprofen": "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) that blocks cyclooxygenase (COX) enzymes more reversibly than aspirin. By inhibiting COX, ibuprofen reduces the production of prostaglandins, which are mediators of pain, inflammation, and fever. It has a more balanced effect on the two COX isoforms (COX-1 and COX-2) compared to some other NSAIDs, which contributes to its relatively favorable side effect profile while still providing effective pain relief and anti-inflammatory action.",
  
  "acetaminophen": "Acetaminophen (paracetamol) primarily works by inhibiting cyclooxygenase (COX) enzymes in the central nervous system rather than throughout the body. This selective action reduces the production of prostaglandins in the brain, which lowers fever and relieves pain. Unlike NSAIDs, acetaminophen has minimal anti-inflammatory effects and doesn't affect blood clotting. Its exact mechanism remains somewhat unclear, but it may also involve the endocannabinoid system and serotonergic pathways.",
  
  "caffeine": "Caffeine primarily acts as an adenosine receptor antagonist in the brain. Adenosine is a neurotransmitter that promotes sleep and suppresses arousal. By blocking adenosine receptors, caffeine prevents adenosine's sleep-promoting effects, resulting in increased alertness and reduced fatigue. Caffeine also stimulates the release of adrenaline, which increases heart rate, blood pressure, and energy availability. Additionally, it enhances dopamine signaling, contributing to its mood-elevating and reinforcing properties."
};

// Function renamed from useLocalFallback to getLocalFallback to avoid React hook linting error
function getLocalFallback(drugName: string): string {
  const normalizedName = drugName.toLowerCase().trim();
  
  // Check for exact matches
  if (normalizedName in knownDrugs) {
    return knownDrugs[normalizedName];
  }
  
  // Check for partial matches
  for (const [drug, explanation] of Object.entries(knownDrugs)) {
    if (normalizedName.includes(drug) || drug.includes(normalizedName)) {
      return explanation;
    }
  }
  
  return `Information about how ${drugName} works is not available in our database. ${drugName} likely has a specific mechanism of action related to its molecular structure that affects biological processes in the body. For accurate information, please consult reliable medical sources or a healthcare professional.`;
}

// Local fallback data for common drug interactions when AI is unavailable
function getLocalInteractionData(drugNames: string[]) {
  interface DrugInteraction {
    drugs: string[];
    effect: string;
    mechanism: string;
    severity: string;
    recommendation: string;
  }

  type KnownInteractions = {
    [key: string]: DrugInteraction;
  };

  const knownInteractions: KnownInteractions = {
    // Aspirin interactions
    "aspirin+ibuprofen": {
      drugs: ["Aspirin", "Ibuprofen"],
      effect: "Increased risk of gastrointestinal bleeding and decreased effectiveness of aspirin's cardioprotective effects",
      mechanism: "Both drugs inhibit COX enzymes and have antiplatelet effects, leading to additive GI toxicity",
      severity: "Moderate",
      recommendation: "Avoid concurrent regular use if possible. Take ibuprofen at least 8 hours before or 30 minutes after aspirin if needed."
    },
    "aspirin+warfarin": {
      drugs: ["Aspirin", "Warfarin"],
      effect: "Increased risk of bleeding",
      mechanism: "Aspirin inhibits platelet function while warfarin inhibits clotting factors, creating an additive anticoagulant effect",
      severity: "Severe",
      recommendation: "Avoid combination unless specifically prescribed by a physician with close monitoring"
    },
    // Common NSAID interactions
    "ibuprofen+naproxen": {
      drugs: ["Ibuprofen", "Naproxen"],
      effect: "Increased risk of gastrointestinal bleeding and kidney damage",
      mechanism: "Both are NSAIDs that inhibit prostaglandin production, leading to additive side effects",
      severity: "Moderate",
      recommendation: "Avoid taking multiple NSAIDs together"
    },
    // Blood pressure medication interactions
    "lisinopril+spironolactone": {
      drugs: ["Lisinopril", "Spironolactone"],
      effect: "Increased risk of hyperkalemia (elevated potassium levels)",
      mechanism: "Both medications can increase potassium levels through different mechanisms",
      severity: "Moderate",
      recommendation: "Monitor potassium levels regularly when using this combination"
    },
    // Antibiotic interactions
    "amoxicillin+birth control": {
      drugs: ["Amoxicillin", "Oral contraceptives"],
      effect: "Potential reduced effectiveness of hormonal contraceptives",
      mechanism: "Antibiotics may reduce gut bacteria that recirculate estrogens",
      severity: "Mild",
      recommendation: "Use a backup method of contraception during antibiotic treatment and for 7 days afterward"
    },
    // Statin interactions
    "atorvastatin+grapefruit": {
      drugs: ["Atorvastatin", "Grapefruit juice"],
      effect: "Increased statin levels and risk of side effects like muscle pain and liver damage",
      mechanism: "Grapefruit inhibits CYP3A4 enzymes that metabolize statins",
      severity: "Moderate",
      recommendation: "Avoid grapefruit products while taking atorvastatin"
    }
  };

  const summary = "Based on the drugs you've selected, there may be potential interactions that could affect their efficacy or safety.";
  const interactions = [];

  // Check each possible drug pair
  for (let i = 0; i < drugNames.length; i++) {
    for (let j = i + 1; j < drugNames.length; j++) {
      const drug1 = drugNames[i].toLowerCase();
      const drug2 = drugNames[j].toLowerCase();
      
      // Check both possible orderings of the pair
      const key1 = `${drug1}+${drug2}`;
      const key2 = `${drug2}+${drug1}`;
      
      if (knownInteractions[key1]) {
        interactions.push(knownInteractions[key1]);
      } else if (knownInteractions[key2]) {
        interactions.push(knownInteractions[key2]);
      }
    }
  }

  // Determine highest severity level
  let highestSeverity = "none";
  if (interactions.some(i => i.severity === "Severe")) {
    highestSeverity = "Severe";
  } else if (interactions.some(i => i.severity === "Moderate")) {
    highestSeverity = "Moderate";
  } else if (interactions.some(i => i.severity === "Mild")) {
    highestSeverity = "Mild";
  }

  return {
    summary: interactions.length > 0 
      ? summary 
      : "No known interactions found between the selected drugs in our local database.",
    interactions: interactions,
    severity: highestSeverity,
    recommendation: interactions.length > 0 
      ? "Consult your healthcare provider before taking these medications together."
      : "Always consult with a healthcare professional about potential drug interactions."
  };
}

// Default export that uses Gemini with local fallback
export async function generateDrugExplanation(drugName: string) {
  try {
    return await generateWithGemini(drugName);
  } catch {
    console.log("Using local fallback...");
    return getLocalFallback(drugName);
  }
}