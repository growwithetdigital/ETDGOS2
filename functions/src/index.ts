import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenAI } from '@google/genai';
import * as nodemailer from 'nodemailer';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage().bucket();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({ apiKey });
};

// Transporter configured with hello@growwithetdigital.com vanity domain
const mailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * 1. User Creation Trigger: Welcome Email from hello@growwithetdigital.com
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;

  const userDocRef = db.collection('users').doc(uid);
  await userDocRef.set({
    uid,
    email: email || '',
    displayName: displayName || 'Growth Partner',
    emailVerified: user.emailVerified || false,
    tier: 'free',
    status: 'active',
    has_seen_welcome: false,
    last_generated_timestamp: null,
    next_eligible_timestamp: null,
    total_generations_count: 0,
    audit_id: null,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  if (email) {
    try {
      await mailTransport.sendMail({
        from: '"Eric Thomas | ET Digital" <hello@growwithetdigital.com>',
        to: email,
        subject: 'Welcome to your ET Digital Growth Operating System',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #0f172a; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 24px;">
              <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #0891b2; background-color: #ecfeff; padding: 4px 8px; border-radius: 4px; border: 1px solid #cffafe;">ET DIGITAL GROWTH OS</span>
            </div>
            <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 12px 0 16px;">Welcome to Your Growth Whiteboard</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">Hi ${displayName || 'there'},</p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Your account has been initialized. You now have access to your marketing diagnostic records and your quarterly AI Growth Package.
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              <strong>Important Next Step:</strong> Please bookmark your dashboard URL and add it to your desktop or mobile home screen for quick on-the-go access.
            </p>
            <p style="margin: 28px 0;">
              <a href="https://growwithetdigital.com" style="background-color: #06b6d4; color: #020617; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; display: inline-block;">
                Launch My Growth OS
              </a>
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0 20px;" />
            <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
              ET Digital • hello@growwithetdigital.com • Engage. Convert. Grow.
            </p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error('Welcome email dispatch notice:', mailErr);
    }
  }
});

/**
 * 2. Restricted AI Generation: 90-Day Gate, 1,000-word SEO Article, Social Copy & Graphic
 */
export const generateQuarterlyPackage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const uid = context.auth.uid;
  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'User profile not found.');
  }

  const userData = userSnap.data()!;
  const nowMs = Date.now();
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

  // Enforce 90-day cooldown for free tier
  if (userData.tier === 'free' && userData.last_generated_timestamp) {
    const lastGeneratedMs = userData.last_generated_timestamp.toMillis();
    const diff = nowMs - lastGeneratedMs;

    if (diff < NINETY_DAYS_MS) {
      const daysRemaining = Math.ceil((NINETY_DAYS_MS - diff) / (1000 * 60 * 60 * 24));
      throw new functions.https.HttpsError(
        'permission-denied',
        `Free tier limit active. Next package unlocks in ${daysRemaining} days. Upgrade to Monthly for unlimited generation.`
      );
    }
  }

  // Fetch linked audit diagnostic context
  let auditContext = 'Digital customer acquisition, thought leadership, and organic visibility.';
  if (userData.audit_id) {
    const auditSnap = await db.collection('audits').doc(userData.audit_id).get();
    if (auditSnap.exists) {
      const audit = auditSnap.data()!;
      auditContext = `Business: ${audit.business_name}, Website: ${audit.website_url}, Niche: ${audit.primary_niche}, Bottlenecks: ${audit.growth_bottlenecks?.join(', ')}`;
    }
  }

  const ai = getGeminiClient();

  // A. Generate 1,000-Word SEO Article + Cross-Platform Social Media Copy
  const prompt = `
    You are ET Digital's senior growth marketing strategist. Write a comprehensive, tactical 1,000-word SEO-optimized blog post tailored to the following business diagnostic:
    ${auditContext}

    Respond ONLY in valid JSON matching this schema:
    {
      "title": "Compelling Title",
      "target_keyword": "Primary Target Keyword",
      "word_count": 1050,
      "markdown_content": "# Heading\\n\\nFull 1,000-word article with actionable subsections and advice...",
      "meta_description": "155 character SEO meta description",
      "social_captions": {
        "linkedin": "Thought leadership post with bullet points and hashtags",
        "twitter_x": "Punchy thread hook / tweet",
        "facebook": "Engaging community-focused summary",
        "instagram_threads": "Short, carousel-friendly slide script"
      }
    }
  `;

  const textResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  const generatedPack = JSON.parse(textResponse.text || '{}');

  // B. Generate Branded Graphic
  const graphicPrompt = `Minimalist modern growth marketing architecture illustration for ${userData.business_name || 'B2B Enterprise'}, cyan and dark slate palette, high resolution 3D vector styling.`;
  let publicDownloadUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80';

  try {
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: graphicPrompt,
      config: { numberOfImages: 1, outputMimeType: 'image/png', aspectRatio: '16:9' },
    });

    if (imageResponse.generatedImages && imageResponse.generatedImages[0]) {
      const base64Image = imageResponse.generatedImages[0].image.imageBytes;
      const imageBuffer = Buffer.from(base64Image, 'base64');

      const contentId = db.collection('users').doc(uid).collection('content_library').doc().id;
      const fileRef = storage.file(`users/${uid}/graphics/${contentId}.png`);
      await fileRef.save(imageBuffer, { contentType: 'image/png', public: true });
      publicDownloadUrl = `https://storage.googleapis.com/${storage.name}/${fileRef.name}`;
    }
  } catch (imgErr) {
    console.warn('Imagen generation fallback notice:', imgErr);
  }

  // C. Save to Firestore Content Library
  const contentId = db.collection('users').doc(uid).collection('content_library').doc().id;
  const contentRecord = {
    id: contentId,
    uid,
    type: 'quarterly_growth_pack',
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    blog_post: {
      title: generatedPack.title || 'The 2026 Customer Acquisition Engine',
      target_keyword: generatedPack.target_keyword || 'Growth Operating System',
      word_count: generatedPack.word_count || 1020,
      markdown_content: generatedPack.markdown_content || '',
      meta_description: generatedPack.meta_description || '',
    },
    social_captions: generatedPack.social_captions || {},
    graphic: {
      storage_path: `users/${uid}/graphics/${contentId}.png`,
      public_download_url: publicDownloadUrl,
      prompt_used: graphicPrompt,
      dimensions: { width: 1920, height: 1080 },
    },
  };

  await db.collection('users').doc(uid).collection('content_library').doc(contentId).set(contentRecord);

  // D. Update User Rate-Limit Timestamp
  const nextEligible = new Date(nowMs + NINETY_DAYS_MS);
  await userRef.update({
    last_generated_timestamp: admin.firestore.FieldValue.serverTimestamp(),
    next_eligible_timestamp: admin.firestore.Timestamp.fromDate(nextEligible),
    total_generations_count: admin.firestore.FieldValue.increment(1),
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, contentId, data: contentRecord };
});
