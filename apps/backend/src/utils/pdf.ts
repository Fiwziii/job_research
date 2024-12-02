import fs from 'fs';
import pdf from 'pdf-parse';

interface TextItem {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Column {
    header: string;
    x: number;
    width: number;
}

interface TableRow {
    [key: string]: string;
}

interface ParserOptions {
    columnGapThreshold?: number;
    rowGapThreshold?: number;
    headerPattern?: RegExp;
    removeEmptyRows?: boolean;
    trimValues?: boolean;
    debug?: boolean;
}

type Table = TableRow[];

class PdfTableParser {
    private readonly options: Required<ParserOptions>;
    private textItems: TextItem[] = [];

    constructor(private readonly pdfPath: string, options: ParserOptions = {}) {
        this.options = {
            columnGapThreshold: options.columnGapThreshold ?? 10,
            rowGapThreshold: options.rowGapThreshold ?? 5,
            headerPattern: options.headerPattern ?? /^[A-Za-z0-9\s_-]+$/,
            removeEmptyRows: options.removeEmptyRows ?? true,
            trimValues: options.trimValues ?? true,
            debug: options.debug ?? true
        };
    }

    private log(...args: any[]) {
        if (this.options.debug) {
            console.log(...args);
        }
    }

    private async extractTextWithPositions(): Promise<void> {
        const dataBuffer = fs.readFileSync(this.pdfPath);
        this.log('Raw PDF Buffer:', dataBuffer);
        this.log('Buffer length:', dataBuffer.length);
        this.log('Buffer first 100 bytes:', dataBuffer.slice(0, 100));

        try {
            const data = await pdf(dataBuffer);
            this.log('PDF Metadata:', {
                version: data.version,
                numpages: data.numpages,
                info: data.info,
                metadata: data.metadata
            });

            // Get raw text content
            const rawText = await data.text;
            this.log('Raw Text Content:', rawText);

            // Get detailed text content with positions
            const textContent = await new Promise((resolve) => {
                const page = (data as any).getPage(1);
                page.getTextContent().then((content: any) => {
                    this.log('Text Content Items:', content.items);
                    resolve(content);
                });
            });

            const items = (textContent as any).items || [];
            this.log('Extracted Items Count:', items.length);

            this.textItems = items.map((item: any, index: number) => {
                const textItem = {
                    text: item.str,
                    x: item.transform[4],
                    y: item.transform[5],
                    width: item.width,
                    height: item.height
                };
                this.log(`Item ${index}:`, textItem);
                return textItem;
            });

            this.log('Processed Text Items:', this.textItems);

        } catch (error) {
            // this.log('Error during text extraction:', error);
            // throw error;
        }
    }

    private identifyColumns(): Column[] {
        this.log('Starting column identification...');
        
        const sortedItems = [...this.textItems].sort((a, b) => b.y - a.y);
        this.log('Sorted Items by Y position:', sortedItems);

        const potentialHeaders = sortedItems.filter(item => {
            const isHeader = this.options.headerPattern.test(item.text.trim()) &&
                           item.text.trim().length > 0;
            this.log('Potential header item:', item, 'Is header:', isHeader);
            return isHeader;
        });

        this.log('Identified potential headers:', potentialHeaders);

        // Group headers by Y position
        const headerRows: TextItem[][] = [];
        let currentRow: TextItem[] = [];
        let currentY = potentialHeaders[0]?.y;

        potentialHeaders.forEach(item => {
            this.log('Processing header item:', item);
            this.log('Current Y:', currentY);
            this.log('Y difference:', Math.abs(item.y - currentY));

            if (Math.abs(item.y - currentY) < this.options.rowGapThreshold) {
                currentRow.push(item);
            } else {
                if (currentRow.length > 0) {
                    headerRows.push(currentRow);
                    this.log('Completed header row:', currentRow);
                }
                currentRow = [item];
                currentY = item.y;
            }
        });

        if (currentRow.length > 0) {
            headerRows.push(currentRow);
        }

        this.log('All identified header rows:', headerRows);

        // Select best header row
        const headerRow = headerRows.reduce((prev, curr) => 
            curr.length > prev.length ? curr : prev, [] as TextItem[]);
        
        this.log('Selected header row:', headerRow);

        // Convert to columns
        const columns = headerRow
            .sort((a, b) => a.x - b.x)
            .map(item => ({
                header: this.options.trimValues ? item.text.trim() : item.text,
                x: item.x,
                width: item.width
            }));

        this.log('Final identified columns:', columns);
        return columns;
    }

    private extractTableData(columns: Column[]): Table {
        this.log('Starting table data extraction...');
        this.log('Using columns:', columns);

        const table: Table = [];
        let currentRow: TableRow = {};
        let currentY = 0;

        const sortedItems = [...this.textItems].sort((a, b) => b.y - a.y);
        this.log('Sorted items for data extraction:', sortedItems);

        for (const item of sortedItems) {
            this.log('Processing item:', item);
            this.log('Current Y:', currentY);
            this.log('Y difference:', Math.abs(item.y - currentY));

            if (Math.abs(item.y - currentY) > this.options.rowGapThreshold) {
                if (Object.keys(currentRow).length > 0) {
                    this.log('Completing row:', currentRow);
                    table.push(currentRow);
                }
                currentRow = {};
                currentY = item.y;
            }

            const column = columns.find(col => {
                const distance = Math.abs(item.x - col.x);
                this.log('Column distance for', col.header, ':', distance);
                return distance < this.options.columnGapThreshold;
            });

            if (column) {
                this.log('Matched column:', column);
                const value = this.options.trimValues ? item.text.trim() : item.text;
                currentRow[column.header] = value;
                this.log('Updated row:', currentRow);
            } else {
                this.log('No matching column found for item');
            }
        }

        if (Object.keys(currentRow).length > 0) {
            table.push(currentRow);
        }

        const filteredTable = table.filter(row => {
            const isEmpty = this.options.removeEmptyRows && 
                          Object.values(row).every(value => !value);
            const isHeader = Object.values(row).every(value => 
                this.options.headerPattern.test(value)
            );
            this.log('Row:', row);
            this.log('Is empty:', isEmpty);
            this.log('Is header:', isHeader);
            return !isEmpty && !isHeader;
        });

        this.log('Final extracted table:', filteredTable);
        return filteredTable;
    }

    public async extractTables(): Promise<Table> {
        try {
            this.log('Starting table extraction process...');
            await this.extractTextWithPositions();
            const columns = this.identifyColumns();
            const table = this.extractTableData(columns);
            this.log('Table extraction completed');
            return table;
        } catch (error) {
            this.log('Error during table extraction:', error);
            throw error;
        }
    }

    public async saveAsJson(outputPath: string): Promise<Table> {
        try {
            const tables = await this.extractTables();
            fs.writeFileSync(outputPath, JSON.stringify(tables, null, 2));
            this.log('Tables saved to:', outputPath);
            return tables;
        } catch (error) {
            this.log('Error saving JSON:', error);
            throw error;
        }
    }
}

// Example usage:
const testPdfParsing = async () => {
    try {
        const parser = new PdfTableParser('test.pdf', { debug: true });
        const table = await parser.extractTables();
        console.log('Final Result:', table);
    } catch (error) {
        console.error('Test failed:', error);
    }
};

// Export everything
export {
    PdfTableParser,
    testPdfParsing,
    ParserOptions,
    TableRow,
    Table,
    TextItem,
    Column
};