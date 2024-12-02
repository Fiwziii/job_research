
import { ServiceReponse } from "$/types/interface";
import {  ParserOptions, PdfTableParser, testPdfParsing } from "$/utils/pdf";
import { Request } from "express";
import fs from 'fs';
import pdfParse from 'pdf-parse';
const options: ParserOptions = {
    columnGapThreshold: 10,    // Adjust based on your PDF layout
    rowGapThreshold: 5,        // Adjust based on your PDF layout
    headerPattern: /^[A-Za-z0-9\s_-]+$/,  // Pattern to identify headers
    removeEmptyRows: true,
    trimValues: true
};
interface TableRow {
    ที่: string;
    "ชื่อ-สกุล": string;
    "ชื่อบทความ": string;
    "แหล่งตีพิมพ์": string;
    ปี: string;
    ฉบับที่: string;
    เลขหน้า: string;
    คะแนน: string;
  }
  function processTableToJSON(text: string): TableRow[] {
    const lines = text.split('\n');
    const table: TableRow[] = [];
    console.log('lines:', lines);
    lines.forEach((line) => {
      const columns = line.split(/\s{2,}/); 
      if (columns.length >= 8) {
        table.push({
          ที่: columns[0] || '',
          "ชื่อ-สกุล": columns[1] || '',
          "ชื่อบทความ": columns[2] || '',
          "แหล่งตีพิมพ์": columns[3] || '',
          ปี: columns[4] || '',
          ฉบับที่: columns[5] || '',
          เลขหน้า: columns[6] || '',
          คะแนน: columns[7] || '',
        });
      }
    });
  
    return table;
  }

export default {
    test: async (req: Request): Promise<ServiceReponse> => {
        // testPdfParsing().catch(console.error);

        // const parser = new PdfTableParser('./storage/test.pdf', {
        //     debug: true,
        //     columnGapThreshold: 10,
        //     rowGapThreshold: 5
        // });
        
        // parser.extractTables()
        //     .then(table => console.log('Extracted table:', table))
        //     .catch(error => console.error('Error:', error));

        fs.readFile('./storage/kak2.pdf', (err, pdfBuffer) => {
            if (err) {
              console.error('Error reading PDF file:', err);
              return;
            }
          
            pdfParse(pdfBuffer)
              .then((data) => {
                // console.log('PDF Text Content:', data.text);
          
                const tableJSON: TableRow[] = processTableToJSON(data.text);
                console.log('Extracted Table as JSON:', JSON.stringify(tableJSON, null, 2));
              })
              .catch((err) => {
                console.error('Error parsing PDF:', err);
              });
          });


        return {
            status: 200,
            message: {
                result: true,
                status: "success",
                msg: "Hello World",
            }
        }

    }
}