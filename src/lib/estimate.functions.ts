import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

const SERVICE_MULTIPLIERS: Record<string, number> = {
  standard: 1,
  deep: 1.6,
  move: 1.9,
  post: 2.3,
};

const FREQ_DISCOUNTS: Record<string, number> = {
  once: 0,
  weekly: 0.2,
  biweekly: 0.15,
  monthly: 0.1,
};

const EXTRA_PRICES: Record<string, number> = {
  fridge: 35,
  oven: 30,
  windows: 40,
  laundry: 25,
  garage: 60,
};

export const estimateCleaningCost = createServerFn({ method: "POST" })
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const mult = SERVICE_MULTIPLIERS[data.serviceType] ?? 1;
    const discount = FREQ_DISCOUNTS[data.frequency] ?? 0;

    const baseLow = Math.max(120, data.sqft * 0.08);
    const baseHigh = Math.max(120, data.sqft * 0.12);
    const roomsLow = data.bedrooms * 12 + data.bathrooms * 20;
    const roomsHigh = data.bedrooms * 15 + data.bathrooms * 25;

    const extrasCost = data.extras.reduce((sum, id) => sum + (EXTRA_PRICES[id] ?? 0), 0);

    const lowPrice = Math.round((baseLow * mult + roomsLow + extrasCost) * (1 - discount));
    const highPrice = Math.round((baseHigh * mult + roomsHigh + extrasCost) * (1 - discount));

    const estimatedHours = Math.round((data.sqft / 500 + data.bedrooms * 0.5 + data.bathrooms * 0.75) * mult);

    const serviceLabel = data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1);
    const freqLabel = data.frequency;

    const breakdown = [
      `Base rate (${data.sqft} sqft × ${data.serviceType} service)`,
      `${data.bedrooms} bedroom${data.bedrooms !== 1 ? "s" : ""} + ${data.bathrooms} bathroom${data.bathrooms !== 1 ? "s" : ""}`,
    ];

    if (data.extras.length > 0) {
      breakdown.push(`Add-ons: ${data.extras.join(", ")} (+$${extrasCost})`);
    }

    if (discount > 0) {
      breakdown.push(`${freqLabel} discount (-${Math.round(discount * 100)}%)`);
    }

    let summary = `${serviceLabel} clean for a ${data.homeType.toLowerCase()} with ${data.bedrooms} bedroom${data.bedrooms !== 1 ? "s" : ""} and ${data.bathrooms} bathroom${data.bathrooms !== 1 ? "s" : ""}. `;
    summary += `Estimated ${estimatedHours} hour${estimatedHours !== 1 ? "s" : ""} of cleaning time.`;

    let recommendation = `For a ${data.homeType.toLowerCase()} of this size, the ${data.serviceType}-clean package offers the best value. `;
    if (data.frequency !== "once") {
      const saved = Math.round((1 - Math.pow(1 - discount, 12)) * 100);
      recommendation += `With ${freqLabel} visits you save ~${saved}% annually.`;
    } else {
      recommendation += "Book a recurring visit to save up to 20% per clean.";
    }

    return {
      lowPrice,
      highPrice,
      estimatedHours,
      summary,
      breakdown,
      recommendation,
    };
  });
