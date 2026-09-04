import { firebaseAdmin } from "@/lib/db";
import { prisma } from "@/lib/db";

/**
 * Sends a broadcast push notification to all registered tokens.
 */
export async function sendMulticastNotification(title: string, body: string, image?: string, link?: string) {
  try {
    const tokens = await prisma.pushToken.findMany();
    if (!tokens || tokens.length === 0) {
      console.log("No registered push tokens found. Skipping broadcast.");
      return;
    }

    const tokenStrings = tokens.map((t: any) => t.token);

    // Prepare payload
    const notification: any = {
      title,
      body,
    };
    if (image) {
      notification.image = image;
    }

    const data: any = {
      click_action: link || "/",
    };
    if (image) {
      data.image = image;
    }

    if (firebaseAdmin) {
      try {
        const response = await firebaseAdmin.messaging().sendEachForMulticast({
          tokens: tokenStrings,
          notification,
          data
        });
        console.log(`Successfully sent ${response.successCount} broadcast push notifications. Failed: ${response.failureCount}`);
        
        // Optionally clean up invalid tokens from the database if they failed
        if (response.failureCount > 0) {
          response.responses.forEach(async (resp: any, idx: number) => {
            if (!resp.success) {
              const badToken = tokenStrings[idx];
              console.log(`Removing expired or invalid push token: ${badToken}`);
              await prisma.pushToken.deleteMany({ where: { token: badToken } });
            }
          });
        }
      } catch (err: any) {
        console.error("Firebase admin messaging invocation failed:", err.message || err);
      }
    } else {
      console.warn("⚠️ Firebase Admin SDK is not initialized. Push notifications are disabled in local fallback mode.");
    }
  } catch (err) {
    console.error("Error sending multicast notification:", err);
  }
}

/**
 * Sends a personal push notification to a specific user's tokens.
 */
export async function sendPersonalNotification(userId: string, title: string, body: string, image?: string, link?: string) {
  try {
    if (!userId) return;

    const tokens = await prisma.pushToken.findMany({
      where: { userId }
    });
    if (!tokens || tokens.length === 0) {
      console.log(`No registered push tokens found for user ${userId}. Skipping personal notification.`);
      return;
    }

    const tokenStrings = tokens.map((t: any) => t.token);

    const notification: any = {
      title,
      body,
    };
    if (image) {
      notification.image = image;
    }

    const data: any = {
      click_action: link || "/",
    };
    if (image) {
      data.image = image;
    }

    if (firebaseAdmin) {
      try {
        const response = await firebaseAdmin.messaging().sendEachForMulticast({
          tokens: tokenStrings,
          notification,
          data
        });
        console.log(`Successfully sent ${response.successCount} push notifications to user ${userId}.`);
      } catch (err: any) {
        console.error("Firebase admin messaging invocation failed for personal push:", err.message || err);
      }
    } else {
      console.warn("⚠️ Firebase Admin SDK is not initialized. Push notifications are disabled in local fallback mode.");
    }
  } catch (err) {
    console.error("Error sending personal notification:", err);
  }
}
