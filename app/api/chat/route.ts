import { NextResponse } from "next/server";

type PlainMessage = {
  role: "user" | "assistant";
  content: string;
};

const knowledgeBase: Record<string, string> = {
  travel:
    "Here is a plan that balances discovery, local food finds, and stress-free pacing. Travel light, reserve ahead, and carve out unstructured time to follow your curiosity.",
  brainstorming:
    "Let's break the idea into a problem, a differentiated approach, and the smallest experiment you can run this week to prove value.",
  summary:
    "I'll compress the key takeaways, highlight critical numbers, and surface action items in a tidy list."
};

const emojiPalette = ["✨", "🚀", "🌱", "🧠", "🌟", "🗺️", "🎯"];

const introPhrases = [
  "Here’s a structured way to look at it:",
  "Let’s break this into clear next steps:",
  "Here’s a thoughtful walkthrough:"
];

const outroPhrases = [
  "Let me know what you want to dive deeper into.",
  "Want to iterate on any part of this?",
  "I can expand any section—just say the word."
];

function categorize(prompt: string): keyof typeof knowledgeBase | "general" {
  const text = prompt.toLowerCase();
  if (text.match(/trip|travel|itinerary|vacation/)) return "travel";
  if (text.match(/brainstorm|idea|startup|concept/)) return "brainstorming";
  if (text.match(/summary|summarize|recap|outline/)) return "summary";
  return "general";
}

function synthesizeSections(prompt: string): string[] {
  const segments: string[] = [];
  if (prompt.match(/plan|schedule|timeline/gi)) {
    segments.push("Timeline with milestones and checkpoints.");
  }
  if (prompt.match(/tips|recommend/gi)) {
    segments.push("Actionable tips tailored to your context.");
  }
  if (prompt.match(/resources|tools|apps/gi)) {
    segments.push("Tool and resource recommendations worth exploring.");
  }
  if (segments.length === 0) {
    segments.push("Key ideas distilled into quick-read bullets.");
    segments.push("Optional next steps so you can get moving fast.");
  }
  return segments;
}

function generateReply(conversation: PlainMessage[]): string {
  const lastMessage = [...conversation].reverse().find((msg) => msg.role === "user");
  if (!lastMessage) {
    return "I’m here and ready whenever you want to start the conversation.";
  }

  const prompt = lastMessage.content.trim();
  if (prompt.length === 0) {
    return "Could you share a bit more detail so I can help more precisely?";
  }

  const category = categorize(prompt);
  const intro = introPhrases[Math.floor(Math.random() * introPhrases.length)];
  const outro = outroPhrases[Math.floor(Math.random() * outroPhrases.length)];
  const emoji = emojiPalette[Math.floor(Math.random() * emojiPalette.length)];
  const core =
    category === "general"
      ? "I’ll think through this with structured reasoning and keep things concise."
      : knowledgeBase[category];
  const sections = synthesizeSections(prompt)
    .map((section, index) => `${index + 1}. ${section}`)
    .join("\n");

  return `${emoji} ${intro}\n\n${core}\n\n${sections}\n\n${outro}`;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as { conversation?: PlainMessage[] };
    const conversation = data.conversation ?? [];
    const reply = generateReply(conversation);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { reply: "Something went wrong on my end—mind trying again?" },
      { status: 500 }
    );
  }
}
