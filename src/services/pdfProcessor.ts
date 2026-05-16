import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import workerScript from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = workerScript;

export async function processPdfInBatches(
  file: File,
  onInit: (numPages: number) => void,
  processPage: (pageNumber: number, text: string) => Promise<void>
): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  // Using Uint8Array instead of data directly
  const uint8Array = new Uint8Array(arrayBuffer);
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
  const numPages = pdf.numPages;
  onInit(numPages);

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    let text = '';
    let lastY = -1;
    for (const item of (textContent.items as any[])) {
        if (lastY !== item.transform[5] && lastY !== -1) {
            text += '\n';
        } else if (lastY !== -1) {
            text += ' '; // Add space between words
        }
        text += item.str;
        lastY = item.transform[5];
    }
    text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "\n");

    await retryWithExponentialBackoff(async () => {
      await processPage(i, text);
    }, i);
  }
}

async function retryWithExponentialBackoff(
  fn: () => Promise<void>,
  pageNumber: number,
  retries: number = 10,
  delayMs: number = 2000
): Promise<void> {
  try {
    await fn();
  } catch (error: any) {
    const isRetryableError = !String(error?.message || '').includes('400') && !String(error?.message || '').includes('401');
    
    if (isRetryableError && retries > 0) {
      console.warn(`Retryable error on page ${pageNumber}. Retrying... in ${delayMs / 1000}s (${retries} attempts left). Error details: ${error?.message || error}`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return retryWithExponentialBackoff(fn, pageNumber, retries - 1, delayMs + 2000);
    }
    throw error;
  }
}
