/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult } from "../types";

// The platform injects GEMINI_API_KEY automatically in the preview.
// For local development, this will use the key from your .env file.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractDataFromText(text: string, previousColumns?: string[]): Promise<ExtractionResult & { _columns?: string[] }> {
  try {
    const columnsInstruction = previousColumns && previousColumns.length > 0
      ? `   - "columns": You MUST output EXACTLY these columns in the same order: ${JSON.stringify(previousColumns)}. If the text data maps to these columns, insert it into the row array at the corresponding index. Use empty strings "" for missing data to maintain the column structure. Ignore any new columns not in this list.`
      : `   - "columns": An array of strings containing the EXACT column headers found in the table. Do not try to standardise them (e.g. use "Item Name", "opening Qty" exactly as printed). If there is an applicable context like a party/customer name that is not a column, ADD an explicit "Party Name" header at the start of this array.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          parts: [
            {
              text: `You are a highly accurate Pharmaceutical Data Extraction Tool.
              Your task is to extract tabular sales, invoice, or stock data from the following text (which is OCR'd from a PDF).
              
              CRITICAL RULES:
              1. RECURRING PAGE HEADERS: Identify and IGNORE any recurring page headers (e.g., Company Names, page numbers, or titles at the absolute top of the page).
              2. IDENTIFY RETAILERS/PARTIES: In some reports, the actual 'Customer/Retailer/Party' name appears as a distinct line before a block of transactions.
              3. EXTRACT EVERYTHING EXCEPT TOTALS: Extract EVERY valid line item representing a sale, transaction, OR inventory/stock record. Treat dashes ('-') as valid empty/zero entries. DO NOT extract "Total", "Grand Total", "Sub Total", or "Page Total" rows. The system calculates these manually.
              4. PHARMA PRODUCT NAMES VS UNITS (CRITICAL): Pharma product names often contain numbers, concentrations, or pack sizes (e.g., "LUPIZYME ADV TAB 10*10", "DOXO 500 MG"). DO NOT merge the explicitly separate "Unit", "Pack", or "Qty" column values into the "Item Name"/Product column. Respect the visual boundaries and column alignments.
              5. TABLE STRUCTURE (CRITICAL): Return the data STRICTLY as a JSON object with two keys: "columns" and "items".
${columnsInstruction}
                 - "items": An array of objects. Each object represents a row of data. The keys of EVERY object MUST exactly match the items in the "columns" array.
              6. NO SHIFTING DATA: This is the most crucial rule! If a value is missing or blank for a specific column in a row, you MUST put an empty string "" for that key. Do NOT move the next column's value into the wrong key. Read carefully to align values to their actual headers (e.g., if 'Unit' is missing but 'Purchase Qty' is present, leave 'Unit' empty and put the quantity in 'Purchase Qty').

              Example Output Format:
              {
                "columns": ["Party Name", "Item Name", "Unit", "opening Qty", "Purchse Qty"],
                "items": [
                  {"Party Name": "SOME MEDICAL STORE", "Item Name": "LUPIZOX TAB", "Unit": "6 X 30", "opening Qty": "60", "Purchse Qty": "-"},
                  {"Party Name": "SOME MEDICAL STORE", "Item Name": "LUPIZYME ADV TAB", "Unit": "15 TAB", "opening Qty": "-", "Purchse Qty": "-"}
                ]
              }
              
              Text content:
              ${text}`
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No data extracted from the text.");
    }

    const parsed = JSON.parse(resultText);
    
    if (parsed.columns && parsed.items) {
      return { items: parsed.items, _columns: parsed.columns };
    }
    
    if (parsed.items) return parsed;
    return { items: [] };
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
}

export async function extractDataFromPDF(fileBase64: string, fileName: string): Promise<ExtractionResult> {
  // ... existing implementation
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              text: `You are an expert Pharmaceutical Sales OCR and Data extraction system. 
              Extract all line items from the sales analysis reports, stockist invoices, inventory reports, or stock statements. 
              Even if the document has hundreds of pages, you must scan and extract every single line item without skipping. Pay special attention to items where values might be dashes ('-').
              
              CRITICAL RULES:
              1. PHARMA PRODUCT NAMES VS UNITS (CRITICAL): Pharma product names often contain numbers, concentrations, or pack sizes (e.g., "LUPIZYME ADV TAB 10*10", "DOXO 500 MG"). DO NOT merge the explicitly separate "Unit", "Pack", or "Qty" column values into the "Item Name"/Product column. Respect the visual boundaries and column alignments.
              2. TABLE STRUCTURE (CRITICAL): Return the data STRICTLY as a JSON object with two keys: "columns" and "items".
                 - "columns": An array of strings containing the EXACT column headers found in the table (e.g. ["Item Name", "Unit", "opening Qty", "Purchse Qty"]). Do not try to standardise them. If there is overarching context like a Party/Customer Name, add "Party Name" to your columns.
                 - "items": An array of objects. Each object represents a row of data. The keys of EVERY object MUST match the "columns" array EXACTLY.
              3. NO SHIFTING DATA: This is the most crucial rule! If a value is missing or blank for a specific column in a row, you MUST put an empty string "" for that key. Do NOT move the next column's value into the wrong key. Read carefully to align values visually observed under specific column headers to exactly those keys.
              4. NEVER skip a row because of empty values.
              5. IGNORE TOTALS: DO NOT extract "Total", "Grand Total", "Sub Total", or "Page Total" rows. Provide only the actual data rows. The system calculates totals automatically.

              Example Output Format:
              {
                "columns": ["Item Name", "Unit", "opening Qty", "Purchse Qty", "PurchBillAmt", "Sales Qty"],
                "items": [
                  {"Item Name": "LUPIZOX TAB", "Unit": "6 X 30", "opening Qty": "60", "Purchse Qty": "-", "PurchBillAmt": "-", "Sales Qty": "47"},
                  {"Item Name": "LUPIZYME ADV TAB 10*10", "Unit": "15 TAB", "opening Qty": "-", "Purchse Qty": "-", "PurchBillAmt": "-", "Sales Qty": "-"}
                ]
              }`
            },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: fileBase64,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No data extracted from the document.");
    }

    const parsed = JSON.parse(resultText);
    
    if (parsed.columns && parsed.items) {
      return { items: parsed.items, _columns: parsed.columns };
    }
    
    if (parsed.items) return parsed;
    return { items: [] };
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
      throw new Error("Gemini API Key missing or invalid. Please check your environment variables.");
    }
    throw error;
  }
}

