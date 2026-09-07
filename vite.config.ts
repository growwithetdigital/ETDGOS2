import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import { GoogleGenAI } from '@google/genai';

function growthApiPlugin(): Plugin {
  return {
    name: 'growth-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/generate-growth-package' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const businessName = parsed.businessName || 'Modern Enterprise';
              const contact = parsed.contact || '';
              const websiteUrl = parsed.websiteUrl || 'https://growwithetdigital.com';
              const location = parsed.location || 'Nationwide';
              const missionStatement = parsed.missionStatement || 'Delivering high-impact solutions with measurable customer outcomes.';
              const competitorWebsite = parsed.competitorWebsite || '';
              const brandVoice = parsed.brandVoice || 'Authoritative & Strategic';
              const targetAudience = parsed.targetAudience || 'Decision-makers and high-intent buyers';
              const industry = parsed.industry || 'B2B & Digital Services';
              const tier = parsed.tier || 'free';

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                // High-value deterministic 400-word article fallback tailored to their profile
                const fallbackTitle = `${businessName}: The High-Velocity Growth Blueprint for ${location}`;
                const fallbackTargetKeyword = `${businessName} ${location} services`;
                const fallbackContent = `# ${fallbackTitle}

In today's fast-evolving market, high-intent buyers in **${location}** don't have time to wade through generic marketing noise. They want definitive solutions from trusted authorities who understand their specific challenges.

At **${businessName}**, our core mission is clear: *"${missionStatement}"*. Yet even market-leading organizations face an urgent bottleneck: converting online discovery into qualified, predictable customer conversations.

---

## 1. The Differentiation Advantage

While competitors${competitorWebsite ? ` like those at ${competitorWebsite}` : ' across the space'} continue relying on outdated, sporadic marketing tactics, modern buyers evaluate trust through clear proof, structured authority, and direct answers. 

To lead the market, **${businessName}** must leverage three strategic differentiators:
* **Hyper-Relevant Geographic Visibility:** Capturing high-intent local and regional search queries from **${targetAudience}**.
* **Zero-Friction Conversion:** Replacing convoluted contact forms with instant diagnostic tools and frictionless intake channels.
* **Consistent Brand Narrative:** Maintaining an **${brandVoice}** tone across every digital touchpoint${contact ? `—from first impression through direct contact with ${contact}` : ''}.

---

## 2. Immediate 30-Day Execution Priority

To establish undeniable category presence, **${businessName}** must prioritize:
1. **Solidify Local Entity Markup:** Ensure your Google Business Profile, local schemas, and search citations align with your primary offerings in **${location}**.
2. **Deploy Intent-Driven Content:** Answer the top 5 questions high-value prospects ask before making an investment decision.
3. **Streamline Conversion Paths:** Drive all inbound inquiries directly to your core service capabilities.

By operating with structured systems rather than random tactics, **${businessName}** turns regional visibility into compounding revenue. Visit [${websiteUrl}](${websiteUrl}) to explore our full capabilities.`;

                const fallbackPayload = {
                  title: fallbackTitle,
                  target_keyword: fallbackTargetKeyword,
                  word_count: 412,
                  meta_description: `An executive growth roadmap for ${businessName} in ${location}: Discover how our mission-driven strategy outperforms conventional competitors.`,
                  markdown_content: fallbackContent,
                  social_captions: {
                    linkedin: `Is your marketing operating as a strategic engine or disconnected tactics?

At ${businessName}, our mission is straightforward: "${missionStatement}".

Here is how we are restructuring digital visibility in ${location} to deliver measurable outcomes for ${targetAudience}:

• Hyper-focused topical authority
• Zero-friction conversion pathways
• Purpose-driven market leadership

Discover our complete methodology at ${websiteUrl}

#GrowthMarketing #${businessName.replace(/\s+/g, '')} #StrategicGrowth #${location.replace(/\s+/g, '')}`,
                    twitter_x: `Why do most customer acquisition campaigns in ${location} stall?

They run tactics without architecture.

Here is how ${businessName} is building compounding authority this quarter 🧵👇: ${websiteUrl}`,
                    facebook: `Looking for reliable, proven outcomes in ${location}? At ${businessName}, we're committed to our mission: ${missionStatement}. Learn how we are setting a new standard for ${targetAudience} at ${websiteUrl}!`,
                    instagram_threads: `Building authority in ${location} comes down to one principle: consistency beats sporadic effort. Explore the core principles driving ${businessName} forward today.`
                  },
                  graphic: {
                    public_download_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
                    prompt_used: `Branded strategic architecture graphic for ${businessName} in ${location}`,
                    dimensions: { width: 1920, height: 1080 }
                  }
                };

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  fallback: true,
                  package: fallbackPayload
                }));
                return;
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `
                You are ET Digital's senior growth marketing strategist. Write a high-impact, SEO-optimized blog post for ${businessName}.
                
                Business Context & Voice Parameters:
                - Business Name: ${businessName}
                - Primary Contact: ${contact || 'Leadership'}
                - Website URL: ${websiteUrl}
                - Location / Market: ${location}
                - Mission Statement: "${missionStatement}"
                - Primary Competitor Website: ${competitorWebsite || 'None specified'}
                - Brand Voice / Tone: ${brandVoice}
                - Target Audience: ${targetAudience}
                - Industry: ${industry}
                - User Tier: ${tier}

                CRITICAL INSTRUCTION FOR LENGTH & FORMAT:
                - Since the user tier is "${tier}", generate a concise, authoritative, and tactical blog article of EXACTLY 380 to 420 words (around 400 words total).
                - Do NOT write 1,000 words. Keep it tightly focused around 400 words.
                - Weave the business's location (${location}), mission statement, and distinct edge over competitors (${competitorWebsite || 'legacy alternatives'}) naturally into the text.
                - Write in the requested voice: ${brandVoice}.
                
                Respond ONLY in valid JSON matching this schema:
                {
                  "title": "Compelling, punchy SEO title",
                  "target_keyword": "Primary target search keyword",
                  "word_count": 405,
                  "markdown_content": "# Title\\n\\nFull ~400-word article in markdown with ## subheadings, bullet points, and clear call-to-action...",
                  "meta_description": "155 character SEO meta description",
                  "social_captions": {
                    "linkedin": "Thought-leadership post matching the brand voice with bullet points and hashtags",
                    "twitter_x": "Punchy thread hook or tweet",
                    "facebook": "Engaging community-oriented summary",
                    "instagram_threads": "Short, swipeable slide text"
                  }
                }
              `;

              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json' },
              });

              const generated = JSON.parse(response.text || '{}');
              const payload = {
                title: generated.title || `${businessName}: The High-Velocity Growth Blueprint for ${location}`,
                target_keyword: generated.target_keyword || `${businessName} ${location} services`,
                word_count: generated.word_count || 410,
                markdown_content: generated.markdown_content || '',
                meta_description: generated.meta_description || `Strategic growth insights for ${businessName} in ${location}.`,
                social_captions: generated.social_captions || {
                  linkedin: `How ${businessName} is transforming digital visibility in ${location}.`,
                  twitter_x: `Tactical growth architecture for ${businessName}.`,
                  facebook: `Discover the 2026 growth blueprint for ${businessName}.`,
                  instagram_threads: `Scaling pipeline through systematic architecture.`
                },
                graphic: {
                  public_download_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
                  prompt_used: `Branded modern growth architecture graphic for ${businessName}`,
                  dimensions: { width: 1920, height: 1080 }
                }
              };

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, package: payload }));
            } catch (err: any) {
              console.error('API middleware error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), growthApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
