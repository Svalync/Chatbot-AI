export default class PDFJS {
  static async extractDataFromPDFLink(pdfLink: string) {
    const response = await fetch(pdfLink);
    const pdfData = await response.arrayBuffer();
    const pdfJS_DIST = await import('pdfjs-dist/legacy/build/pdf');
       await import('pdfjs-dist/legacy/build/pdf.worker');
    const pdfDoc = await pdfJS_DIST.getDocument({ data: pdfData }).promise;
    // Extract text from all the pages
    let extractedText = '';
    for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++) {
      const page = await pdfDoc.getPage(pageNumber);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map((item: any) => item.str).join(' ');
    }
    return extractedText;
  }

  static async extractDataFromPDFLinks(pdfLinks: string[]) {
    let pdfDatas: string[] = [];
    for (let pdfLink of pdfLinks) {
      const pdfData = await this.extractDataFromPDFLink(pdfLink);
      pdfDatas.push(pdfData);
    }
    return pdfDatas;
  }
}
