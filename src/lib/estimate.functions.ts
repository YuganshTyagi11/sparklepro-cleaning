import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  homeType: z.string().min(1),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  sqft: z.number().int().min(100).max(20000),
  serviceType: z.string().min(1),
  frequency: z.string().min(1),
  extras: z.array(z.string()).default([]),
  notes: z.string().max(600).default(""),
});

export const estimateCleaningCost = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `You are a pricing analyst for SparklePro, a premium residential cleaning service in a mid-size US city.
Estimate a fair price range (USD) for the following job and explain how you priced it.

Job:
- Home type: ${data.homeType}
- Bedrooms: ${data.bedrooms}
- Bathrooms: ${data.bathrooms}
- Square footage: ${data.sqft}
- Service: ${data.serviceType}
- Frequency: ${data.frequency}
- Add-ons: ${data.extras.join(", ") || "none"}
- Notes from customer: ${data.notes || "none"}

Baseline pricing rules to anchor your estimate:
- Standard clean: $0.08-$0.12 per sqft, minimum $120
- Deep clean: 1.6x standard
- Move-in/move-out: 1.9x standard
- Post-construction: 2.3x standard
- Each bedroom adds $15, each bathroom adds $25
- Add-ons: inside fridge $35, inside oven $30, windows $5/window estimate $40, laundry $25, garage $60
- Frequency discounts off recurring visits: weekly -20%, biweekly -15%, monthly -10%

Be concise and confident.`;

    const { output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({
        schema: z.object({
          lowPrice: z.number(),
          highPrice: z.number(),
          estimatedHours: z.number(),
          summary: z.string(),
          breakdown: z.array(z.string()).max(8),
          recommendation: z.string(),
        }),
      }),
      prompt,
    });

    return output;
  });
