
import { GoogleGenAI, Modality, Type } from "@google/genai";

const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) {
    // This is a fallback for development and should not happen in the target environment
    console.warn("API_KEY environment variable not set.");
    return "";
  }
  return key;
};

const getAiClient = () => new GoogleGenAI({ apiKey: getApiKey() });


export const generateImage = async (prompt: string, aspectRatio: string, stylePreset: string, negativePrompt?: string): Promise<string> => {
  const ai = getAiClient();
  const fullPrompt = `${prompt}, ${stylePreset} style ${negativePrompt ? `, avoid ${negativePrompt}` : ''}`;
  
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages[0].image.imageBytes;
  }
  throw new Error("Image generation failed to produce an image.");
};

export const editImage = async (prompt: string, imageUri: string): Promise<string> => {
    const ai = getAiClient();
    const base64Data = imageUri.split(',')[1];
    const mimeType = imageUri.split(';')[0].split(':')[1];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error("Image editing failed to produce an image.");
};

export const generateVideo = async (
  prompt: string,
  aspectRatio: "16:9" | "9:16" | string,
  startImageUri: string | null,
  onProgress: (message: string) => void
): Promise<string> => {
  const ai = getAiClient();

  onProgress("Initializing video generation...");

  const imagePayload = startImageUri ? {
    imageBytes: startImageUri.split(',')[1],
    mimeType: startImageUri.split(';')[0].split(':')[1],
  } : undefined;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    image: imagePayload,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio as "16:9" | "9:16",
    },
  });

  const progressMessages = [
    "Warming up the digital canvas...",
    "Teaching pixels to dance...",
    "Composing a symphony of light and motion...",
    "Almost there, adding the final touches...",
    "Rendering the masterpiece..."
  ];
  let messageIndex = 0;

  while (!operation.done) {
    onProgress(progressMessages[messageIndex % progressMessages.length]);
    messageIndex++;
    await new Promise(resolve => setTimeout(resolve, 10000));
    const currentAiClient = getAiClient(); // Re-create client to get latest key
    operation = await currentAiClient.operations.getVideosOperation({ operation: operation });
  }

  onProgress("Video generation complete!");

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (downloadLink) {
    return downloadLink;
  }
  
  throw new Error("Video generation failed or returned no URI.");
};


export const generateCreativePrompts = async (keyword: string): Promise<string[]> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the keyword "${keyword}", generate 3 diverse, detailed, and visually rich prompts for an AI image generator. The prompts should be creative and inspiring.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    prompts: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        }
                    }
                }
            },
        },
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    return result.prompts || [];
};
