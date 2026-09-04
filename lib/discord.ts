const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1515233183917019231/9HaUtGtuKBLI57SnMnq3uXMs-MDbToKKxekAQJN0TnEtyGkmJBtUPqg60zb7SC7jd-5m";

interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  description: string;
  color?: number;
  fields?: DiscordField[];
}

export async function sendDiscordNotification(payload: DiscordEmbed) {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn("⚠️ Discord webhook URL not configured.");
    return;
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: payload.title,
            description: payload.description,
            color: payload.color ?? 3447003, // Default blue color
            fields: payload.fields ?? [],
            timestamp: new Date().toISOString(),
            footer: {
              text: "Ceramic Bazaar Notification Engine",
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("❌ Failed to send Discord notification:", await response.text());
    }
  } catch (err) {
    console.error("❌ Error sending Discord notification:", err);
  }
}
