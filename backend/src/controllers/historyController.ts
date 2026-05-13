import { Request, Response } from "express";
import prisma from "../prisma";

export const getHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = await prisma.savedFile.findMany({
      where: { userId: req.user.userId },
      select: { id: true, filename: true, savedAt: true },
      orderBy: { savedAt: "desc" },
    });

    res.json(files);
  } catch (err: any) {}
};

export const downloadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const file = await prisma.savedFile.findFirst({
      where: { id: Number(id), userId: req.user.userId },
    });

    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.filename}`
    );

    res.send(file.filedata);
  } catch (err: any) {}
};
