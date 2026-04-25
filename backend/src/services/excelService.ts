import ExcelJS from "exceljs";
import { ClientError } from "../utils/errors";

/**
 * Extract Jira ticket numbers from the "Key" column of an Excel file.
 * @param buffer - The uploaded Excel file as a buffer
 * @returns Array of ticket numbers
 */
export const extractTicketKeys = async (buffer: Buffer): Promise<string[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);

  const worksheet = workbook.worksheets[0];
  const headerRow = worksheet.getRow(1);
  let keyColumnIndex = -1;

  headerRow.eachCell((cell, colNumber) => {
    if (cell.value === "Key") keyColumnIndex = colNumber;
  });

  if (keyColumnIndex === -1) {
    throw new ClientError("No column named 'Key' was found in the Excel file");
  }

  const ticketNumbers: string[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header row
    const cell = row.getCell(keyColumnIndex);
    const cellValue = cell.value;
    if (cellValue) {
      if (typeof cellValue === "object" && "text" in cellValue) {
        ticketNumbers.push(cellValue.text);
      } else {
        ticketNumbers.push(cellValue.toString());
      }
    }
  });

  return ticketNumbers;
};

/**
 * Append "SLA Real Elapsed Time" to the original Excel file
 * @param buffer - The original uploaded Excel file
 * @param results - Map of tickets to calculated SLA in minutes
 * @returns Updated Excel file
 */
export const appendSlaResults = async (
  buffer: Buffer,
  results: Map<string, number | string>
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);

  const worksheet = workbook.worksheets[0];
  const headerRow = worksheet.getRow(1);
  let keyColumnIndex = -1;
  const lastColumnIndex = headerRow.cellCount;

  headerRow.eachCell((cell, colNumber) => {
    if (cell.value === "Key") keyColumnIndex = colNumber;
  });

  if (keyColumnIndex === -1) {
    throw new Error('No column named "Key" was found in the Excel file');
  }

  // Add header for the new column
  headerRow.getCell(lastColumnIndex + 1).value = "SLA Real Elapsed Time";
  headerRow.commit();

  // Fill out the new column
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const cell = row.getCell(keyColumnIndex);
    const cellValue = cell.value;
    let key;
    if (cellValue) {
      if (typeof cellValue === "object" && "text" in cellValue) {
        key = cellValue.text;
      } else {
        key = cellValue?.toString();
      }
    }
    if (key && results.has(key)) {
      row.getCell(lastColumnIndex + 1).value = results.get(key);
      row.commit();
    }
  });

  const updatedBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(updatedBuffer);
};
