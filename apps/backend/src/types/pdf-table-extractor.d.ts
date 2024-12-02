declare module "pdf-table-extractor" {
    interface TableExtractionResult {
      pageTables: {
        page: number;
        tables: string[][];
      }[];
    }
  
    function pdfTableExtractor(
      pdfPath: string,
      successCallback: (result: TableExtractionResult) => void,
      errorCallback: (error: any) => void
    ): void;
  
    export = pdfTableExtractor;
  }
  