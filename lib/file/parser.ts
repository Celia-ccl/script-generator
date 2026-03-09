import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import { FileParseResult } from '@/types/script';

// 动态导入 pdf-to-text 以避免客户端打包问题
async function getPDFParser() {
  if (typeof window !== 'undefined') {
    throw new Error('PDF parsing is not available on the client side');
  }
  const pdfToText = await import('pdf-to-text');
  return pdfToText;
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

      const pdfToText = await getPDFParser();

      // 在服务端处理文件
      if (!(file instanceof File)) {
        throw new Error('Invalid file object');
      }

      // 读取文件内容
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 使用 pdf-to-text 提取文本
      const text = await new Promise<string>((resolve, reject) => {
        (pdfToText as any)(buffer, (error: Error, text: string) => {
          if (error) {
            reject(error);
          } else {
            resolve(text);
          }
        });
      });

      return {
        fileName: file.name,
        fileType: 'pdf',
        text: text.trim(),
        extractedContent: text.trim(),
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
