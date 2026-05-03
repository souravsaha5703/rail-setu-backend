import { GoogleGenAI } from "@google/genai";

export const getAIRecommendedJunctions = async (source, destination, leg1Route, leg2Route) => {

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
        You are the routing engine for "RailSetu". 
        A user wants to travel from ${source} to ${destination}, but direct trains are unavailable or in waitlist or have RAC.
        Your task is to find the top 3 BEST junction stations to break this journey into two legs.

        INPUT DATA:
        - Source: ${source}
        - Destination: ${destination}
        - Leg 1 Route Data (Trains from Source): ${JSON.stringify(leg1Route)}
        - Leg 2 Route Data (Trains to Destination): ${JSON.stringify(leg2Route)}

        RANKING CRITERIA:
        1. Connectivity: Prioritize junctions with the highest number of intersecting trains.
        2. Facilities: Prioritize major "Jn" (Junction) or "Central" or "Terminus" stations.
        3. Logic: The station must appear in both Leg 1 and Leg 2 data.
        4. Ensure the junction logically lies between the source and destination.

        OUTPUT INSTRUCTIONS:
        - Return ONLY a valid JSON object.
        - Do not include any markdown formatting, backticks, or extra text.
        
        SCHEMA:
        {
          "junctions": [
            {
              "rank": 1,
              "stationCode": "string",
              "stationName": "string",
              "leg1": {
                "from": { "code": "string", "name": "string" },
                "to": { "code": "string", "name": "string" }
              },
              "leg2": {
                "from": { "code": "string", "name": "string" },
                "to": { "code": "string", "name": "string" }
              }
            }
          ]
        }
    `;

    const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const text = aiResponse.text;

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return parsed;
}