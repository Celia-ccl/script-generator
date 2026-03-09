import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import { FileParseResult } from '@/types/script';

// 动态导入 pdfjs-dist 以避免客户端打包问题
async function getPDFParser() {
  if (typeof window !== 'undefined') {
    throw new Error('PDF parsing is not available on the client side');
  }
  const { default: pdfjs } = await import('pdfjs-dist');
  return pdfjs;
}

/**
 * 文件解析工具类
 * 支持：图片（OCR）、PDF、Word 文档的文本提取
 */
export class FileParser {
  /**
   * 根据文件类型解析文件
   */
  static async parseFile(file: File): Promise<FileParseResult> {
    const fileType = this.getFileType(file);

    switch (fileType) {
      case 'image':
        return await this.parseImage(file);
      case 'pdf':
        return await this.parsePDF(file);
      case 'docx':
        return await this.parseDocx(file);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  /**
   * 获取文件类型
   */
  private static getFileType(file: File): string {
    const type = file.type.toLowerCase();

    if (type.startsWith('image/')) {
      return 'image';
    } else if (type === 'application/pdf') {
      return 'pdf';
    } else if (
      type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      type === 'application/msword'
    ) {
      return 'docx';
    }

    return 'unknown';
  }

  /**
   * 解析图片（使用 OCR）
   */
  private static async parseImage(file: File): Promise<FileParseResult> {
    try {
      const result = await Tesseract.recognize(file, 'chi_sim+eng', {
        logger: (m: any) => console.log(m),
      });

      return {
        fileName: file.name,
        fileType: 'image',
        text: result.data.text.trim(),
        extractedContent: result.data.text.trim(),
      };
    } catch (error) {
      console.error('Image parsing error:', error);
      throw new Error('Failed to parse image');
    }
  }

  /**
   * 解析 PDF
   */
  private static async parsePDF(file: File): Promise<FileParseResult> {
    try {
      // 确保在服务端运行
      if (typeof window !== 'undefined') {
        throw new Error('PDF parsing must be done on the server side');
      }

      const pdfjsLib = await getPDFParser();

      // 在服务端处理文件
      if (!(file instanceof File)) {
        throw new Error('Invalid file object');
      }

      // 设置 pdfjs-dist 的工作者
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      // 读取文件内容
      const arrayBuffer = await file.arrayBuffer();

      // 加载 PDF 文档
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;

      // 提取所有页面的文本
      let fullText = '';
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // 提取页面中的文本项
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        fullText += pageText + '\n';
      }

      return {
        fileName: file.name,
        fileType: 'pdf',
        text: fullText.trim(),
        extractedContent: fullText.trim(),
      };
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  /**
   * 解析 Word 文档
   */
  private static async parseDocx(file: File): Promise<FileParseResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });

      return {
        fileName: file.name,
        fileType: 'docx',
        text: result.value.trim(),
        extractedContent: result.value.trim(),
      };
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Failed to parse Word document');
    }
  }

  /**
   * 批量解析文件
   */
  static async parseFiles(files: File[]): Promise<FileParseResult[]> {
    const results: FileParseResult[] = [];

    for (const file of files) {
      try {
        const result = await this.parseFile(file);
        results.push(result);
      } catch (error) {
        console.error(`Failed to parse file: ${file.name}`, error);
        // 继续处理其他文件
      }
    }

    return results;
  }
}
