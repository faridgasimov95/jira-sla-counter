import ExcelJS from "exceljs";
import { ClientError } from "../utils/errors";
import { SlaResultMap } from "../types/sla";

/**
 * Extract Jira ticket numbers from the "Key" column of an Excel file.
 * @param buffer - The uploaded Excel file as a buffer
 * @returns Array of ticket numbers
 */
export const extractTicketData = async (
  buffer: Buffer
): Promise<Map<string, string>> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);

  const worksheet = workbook.worksheets[0];
  const headerRow = worksheet.getRow(1);
  let keyColumnIndex = -1;
  let priorityColumnIndex = -1;

  headerRow.eachCell((cell, colNumber) => {
    if (cell.value === "Key") keyColumnIndex = colNumber;
  });

  headerRow.eachCell((cell, colNumber) => {
    if (cell.value === "P") priorityColumnIndex = colNumber;
  });

  if (keyColumnIndex === -1) {
    throw new ClientError("No column named 'Key' was found in the Excel file");
  }

  const ticketNumbers = new Map<string, string>();

  const isValidKey = (key: string) => /^[A-Z]+-\d+$/.test(key);

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header row
    const keyCell = row.getCell(keyColumnIndex);
    const keyValue = keyCell.value;
    const prioCell =
      priorityColumnIndex !== -1 ? row.getCell(priorityColumnIndex) : null;
    const prioValue = prioCell?.value;

    let key: string | undefined;
    if (keyValue) {
      if (typeof keyValue === "object" && "text" in keyValue) {
        key = keyValue.text;
      } else {
        key = keyValue.toString();
      }
    }

    let prio: string = "";
    if (prioValue) {
      if (typeof prioValue === "object" && "text" in prioValue) {
        prio = prioValue.text;
      } else {
        prio = prioValue.toString();
      }
    }

    if (key && isValidKey(key)) {
      ticketNumbers.set(key, prio);
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
  results: SlaResultMap
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

  // Add header for the new column (minutes)
  headerRow.getCell(lastColumnIndex + 1).value = "SLA Real Elapsed Time";
  const slaColumn = worksheet.getColumn(lastColumnIndex + 1);
  autoFitColumnWidth(slaColumn);
  slaColumn.numFmt = "@";

  // Add header for the new column (status)
  headerRow.getCell(lastColumnIndex + 2).value = "SLA Status";
  const statusColumn = worksheet.getColumn(lastColumnIndex + 2);
  autoFitColumnWidth(statusColumn);
  statusColumn.numFmt = "@";

  // Add header for the new column (note)
  headerRow.getCell(lastColumnIndex + 3).value = "Note";
  const noteColumn = worksheet.getColumn(lastColumnIndex + 3);
  autoFitColumnWidth(noteColumn);
  noteColumn.numFmt = "@";

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
      row.getCell(lastColumnIndex + 1).value = results.get(key)?.sla;
      row.getCell(lastColumnIndex + 2).value = results.get(key)?.status;
      row.getCell(lastColumnIndex + 3).value = results.get(key)?.note;
      row.commit();
    }
  });

  const updatedBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(updatedBuffer);
};

/**
 * Auto-fit column's width
 *
 * @param column
 * @param minimalWidth
 */
export const autoFitColumnWidth = (
  column: ExcelJS.Column,
  minimalWidth = 10
) => {
  let maxColumnLength = 0;
  column.eachCell({ includeEmpty: true }, (cell) => {
    maxColumnLength = Math.max(
      maxColumnLength,
      minimalWidth,
      cell.value ? cell.value.toString().length : 0
    );
  });
  column.width = maxColumnLength + 2;
};
