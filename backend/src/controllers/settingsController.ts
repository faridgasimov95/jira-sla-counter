import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * User settings controller.
 * Handles getting and updating user settings.
 */
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

export const getSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await prisma.settings.findUnique({
      where: { userId: req.user.userId },
    });

    res.json(settings ?? {});
  } catch (err) {
    console.error("Settings fetch error:", err);
    res
      .status(500)
      .json({ error: "Fetching setting failed. Please try again." });
  }
};

export const updateSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      jiraSubdomain,
      jiraUsername,
      jiraToken,
      ignoredStatusCodes,
      priorityThresholds,
      country,
      excelPassword,
    } = req.body;

    const settings = await prisma.settings.upsert({
      where: { userId: req.user.userId },
      update: {
        jiraSubdomain,
        jiraUsername,
        jiraToken,
        ignoredStatusCodes,
        priorityThresholds,
        country,
        excelPassword,
      },
      create: {
        userId: req.user.userId,
        jiraSubdomain,
        jiraUsername,
        jiraToken,
        ignoredStatusCodes,
        priorityThresholds,
        country,
        excelPassword,
      },
    });

    res.json(settings);
  } catch (err) {
    console.error("Settings update error:", err);
    res
      .status(500)
      .json({ error: "Updating setting failed. Please try again." });
  }
};
