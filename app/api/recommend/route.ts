import { NextRequest, NextResponse } from 'next/server';
import { Mistral } from '@mistralai/mistralai';
import { QuizAnswers, Personality, GameRecommendation, QuizResults } from '../../../types/game';

interface RequestBody {
  answers: QuizAnswers;
  personality: Personality;
}

// Initialize Mistral client
const mistral = new Mistral({
  apiKey: process.env.MISTRAL_AI_API_KEY ?? '',
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { answers, personality }: RequestBody = await request.json();

    // Generate a detailed prompt based on personality traits
    const prompt = generateRecommendationPrompt(personality);

    const recommendations = await generateAIGameRecommendations(prompt);

    const results: QuizResults = {
      recommendations,
      personality,
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Mistral API Error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations from AI service' }, { status: 500 });
  }
}

function generateRecommendationPrompt(personality: Personality): string {
  const { primaryTraits, allTraits, playstyle } = personality;

  return `As an expert gaming advisor, recommend 3 specific video games that perfectly match this gaming personality:

PLAYSTYLE: ${playstyle}
PRIMARY TRAITS: ${primaryTraits.join(', ')}
ALL TRAITS: ${allTraits.join(', ')}

CRITERIA FOR RECOMMENDATIONS:
- Recommend REAL, existing games that are well-reviewed and popular
- Match games to the playstyle and personality traits
- Include a mix of genres that align with their preferences
- Consider games with appropriate time commitment
- Include both popular titles and hidden gems

RESPONSE FORMAT: Return ONLY valid JSON in this exact structure:
{
  "recommendations": [
    {
      "name": "Game Name",
      "description": "Brief engaging description of the game and its core gameplay",
      "genre": "Primary genres separated by commas",
      "timeRequired": "Expected playtime or session length",
      "players": "Single Player, Multiplayer, or Both",
      "rating": "Critical rating or user score out of 10",
      "matchReason": "Specific explanation why this game matches their personality and playstyle",
      "store_url": "https://store.steampowered.com/search/?term=EXACT_GAME_NAME",
      "similarGames": "2-3 similar games they might also enjoy"
    }
  ]
}

Make sure the store_url uses exact game names for accurate Steam searches and all fields are properly filled.`;
}

async function generateAIGameRecommendations(prompt: string): Promise<GameRecommendation[]> {
  try {
    const response = await mistral.chat.complete({
      model: 'mistral-small-latest', // or "mistral-medium-latest" for better reasoning
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 2000,
      responseFormat: { type: 'json_object' },
    });

    const message = response.choices[0]?.message;

    if (!message || !message.content) {
      throw new Error('No content received from Mistral AI');
    }

    // Handle both string and ContentChunk[] types
    let contentString: string;

    if (typeof message.content === 'string') {
      contentString = message.content;
    } else if (Array.isArray(message.content)) {
      // If it's a ContentChunk[], concatenate all text content
      contentString = message.content
        .map((chunk) => {
          if (typeof chunk === 'string') {
            return chunk;
          } else if (chunk && typeof chunk === 'object' && 'text' in chunk) {
            return chunk.text;
          }
          return '';
        })
        .join('');
    } else {
      throw new Error('Unexpected content format from Mistral AI');
    }

    // Clean the content string - remove markdown code blocks if present
    const cleanedContent = contentString.replace(/```json\s*|\s*```/g, '').trim();

    // Parse the JSON response
    const parsedResponse = JSON.parse(cleanedContent);

    if (!parsedResponse.recommendations || !Array.isArray(parsedResponse.recommendations)) {
      throw new Error('Invalid response format from Mistral AI');
    }

    // Validate and transform the recommendations
    const validatedRecommendations: GameRecommendation[] = parsedResponse.recommendations.map((rec: any, index: number) => ({
      name: rec.name || `Game ${index + 1}`,
      description: rec.description || 'An engaging game that matches your playstyle.',
      genre: rec.genre || 'Various',
      timeRequired: rec.timeRequired || 'Varies',
      players: rec.players || 'Single Player',
      rating: rec.rating || '8/10',
      matchReason: rec.matchReason || 'Matches your gaming preferences and playstyle.',
      store_url: rec.store_url || `https://store.steampowered.com/search/?term=${encodeURIComponent(rec.name || 'game')}`,
      similarGames: rec.similarGames || 'Similar titles you might enjoy',
    }));

    return validatedRecommendations;
  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    // Fallback to mock data if AI fails
    return generateMockRecommendationsFallback();
  }
}

function generateMockRecommendationsFallback(): GameRecommendation[] {
  return [
    {
      name: 'Hades',
      description: 'A rogue-like dungeon crawler with incredible combat and story where you battle out of the Underworld.',
      genre: 'Action RPG, Roguelike',
      timeRequired: '30-60 minutes per run',
      players: 'Single Player',
      rating: '10/10',
      matchReason: 'Perfect for short sessions with progressive storytelling and satisfying combat',
      store_url: 'https://store.steampowered.com/app/1145360/Hades/',
      similarGames: 'Dead Cells, Bastion, Transistor',
    },
    {
      name: 'Stardew Valley',
      description: 'A relaxing farming simulation with deep relationships, exploration, and crafting.',
      genre: 'Simulation, RPG',
      timeRequired: 'Flexible sessions',
      players: 'Single Player or Multiplayer',
      rating: '10/10',
      matchReason: 'Great for casual play and creative expression',
      store_url: 'https://store.steampowered.com/app/413150/Stardew_Valley/',
      similarGames: 'Animal Crossing, Harvest Moon, My Time at Portia',
    },
    {
      name: 'Deep Rock Galactic',
      description: 'Cooperative mining shooter with procedurally generated caves and 1-4 player co-op.',
      genre: 'FPS, Cooperative',
      timeRequired: '30-45 minutes per mission',
      players: '1-4 players online',
      rating: '9/10',
      matchReason: 'Excellent teamwork and satisfying progression',
      store_url: 'https://store.steampowered.com/app/548430/Deep_Rock_Galactic/',
      similarGames: 'Left 4 Dead 2, Warframe, Risk of Rain 2',
    },
  ];
}
