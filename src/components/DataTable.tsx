/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Download, Table as TableIcon } from 'lucide-react';
import { ParsedItem } from '../types';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, TextRun } from 'docx';
import { saveAs } from 'file-saver';

interface DataTableProps {
  data: ParsedItem[];
  isLoading: boolean;
}

export function DataTable({ data, isLoading }: DataTableProps) {
  const columns = Array.from(new Set(data.flatMap(d => Object.keys(d))));
  
  // Standard columns we want to appear first if they exist
  const standardOrder = ["date", "invoiceNumber", "name", "productName", "batchNumber", "expiry", "qty", "rate", "city", "amount"];
  const orderedColumns = [
    ...standardOrder.filter(col => columns.includes(col)),
    ...columns.filter(col => !standardOrder.includes(col))
  ];

  const totals: Record<string, number> = {};
  
  // Calculate totals for qty and any amount-like columns
  orderedColumns.forEach(col => {
    if (col === 'qty' || col.toLowerCase().includes('amount') || col.toLowerCase().includes('total')) {
        totals[col] = data.reduce((sum, item) => {
            const valStr = String(item[col] || '');
            // Only strip formatting for calculation if it looks like a number
            const val = parseFloat(valStr.replace(/,/g, '').replace(/[^0-9.-]/g, ''));
            return sum + (isNaN(val) ? 0 : val);
        }, 0);
    }
  });

  const exportToExcel = () => {
    const totalRow: any = { ...orderedColumns.reduce((acc, col) => ({ ...acc, [col]: '' }), {}) };
    if (orderedColumns.length > 0) {
      totalRow[orderedColumns[0]] = 'TOTAL';
    }
    
    Object.keys(totals).forEach(col => {
      totalRow[col] = totals[col];
    });

    const exportData = [ ...data, totalRow ];
    const ws = XLSX.utils.json_to_sheet(exportData, { header: orderedColumns });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pharma Sales Data");
    XLSX.writeFile(wb, "pharma_sales_extract.xlsx");
  };

  const exportToWord = () => {
    const tableHeaders = orderedColumns.map(c => c);
    
    const tableRows = data.map(item => new TableRow({
      children: orderedColumns.map(col => new TableCell({ 
        children: [new Paragraph({ 
          text: item[col] != null ? String(item[col]) : '-', 
          alignment: ['qty', 'rate'].includes(col) || col.toLowerCase().includes('amount') ? AlignmentType.RIGHT : AlignmentType.LEFT 
        })] 
      }))
    }));

    const totalRowChildren = orderedColumns.map((col, idx) => {
        if (idx === 0) {
            return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TOTAL", bold: true })] })] });
        }
        if (totals[col] !== undefined) {
            let val = totals[col];
            if (!['qty'].includes(col) && val % 1 !== 0) {
               val = parseFloat(val.toFixed(2));
            }
            return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(val), bold: true })], alignment: AlignmentType.RIGHT })] });
        }
        return new TableCell({ children: [] });
    });

    const totalRow = new TableRow({
      children: totalRowChildren,
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "CMP IT Solutions - Pharma Sales Analysis Report", heading: "Heading1", alignment: AlignmentType.CENTER }),
          new Paragraph({ text: `Generated on: ${new Date().toLocaleDateString()}`, spacing: { after: 400 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: tableHeaders.map(h => new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
                  shading: { fill: "F3F4F6" }
                }))
              }),
              ...tableRows,
              totalRow
            ]
          })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "pharma_sales_report.docx");
    });
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Processing documents with AI...</p>
        <p className="text-xs text-gray-400">Extracting and structuring pharmaceutical data</p>
      </div>
    );
  }

  if (data.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold">Extracted Sales Data ({data.length})</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={exportToWord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
          >
            <Download className="w-4 h-4" />
            Word Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800/50 border-bottom border-gray-200 dark:border-gray-800">
              {orderedColumns.map((col, idx) => (
                <th key={idx} className={`px-3 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${['qty', 'rate'].includes(col) || col.toLowerCase().includes('amount') ? 'text-right' : ''}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((item, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors whitespace-nowrap">
                {orderedColumns.map((col, colIdx) => (
                  <td key={colIdx} className={`px-3 py-3 text-[11px] ${['qty', 'rate'].includes(col) || col.toLowerCase().includes('amount') ? 'text-right font-mono text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'} ${['invoiceNumber', 'batchNumber'].includes(col) ? 'font-mono' : ''} ${['name', 'productName'].includes(col) ? 'max-w-[150px] truncate' : ''}`}>
                    {item[col] != null ? item[col] : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-800/50">
            <tr className="whitespace-nowrap font-bold">
              {orderedColumns.map((col, idx) => {
                if (idx === 0) {
                  return <td key={idx} className="px-3 py-3 text-[11px] text-gray-900 dark:text-gray-100">TOTAL</td>;
                }
                if (totals[col] !== undefined) {
                  const val = totals[col];
                  const displayVal = !['qty'].includes(col) && val % 1 !== 0 
                     ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                     : val.toLocaleString();
                  return <td key={idx} className="px-3 py-3 text-[11px] text-gray-900 dark:text-gray-100 text-right font-mono">{displayVal}</td>;
                }
                return <td key={idx}></td>;
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
