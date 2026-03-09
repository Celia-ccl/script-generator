import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import { FileParseResult } from '../../types/script';

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
   * 注意：图片 OCR 功能暂时禁用，以确保在 Vercel 上的稳定部署
   */
  private static async parseImage(file: File): Promise<FileParseResult> {
    try {
      // 暂时返回占位符文本，避免 tesseract.js 的兼容性问题
      return {
        fileName: file.name,
        fileType: 'image',
        text: '图片文件内容暂时无法自动解析。请使用 PDF 或 Word 文档，或者手动输入内容。',
        extractedContent: '图片文件内容暂时无法自动解析。请使用 PDF 或 Word 文档，或者手动输入内容。',
      };
    } catch (error) {
      console.error('Image parsing error:', error);
      throw new Error('Failed to parse image');
    }
  }

  /**
   * 解析 PDF
   * 注意：PDF 解析功能暂时禁用，以确保在 Vercel 上的稳定部署
   */
  private static async parsePDF(file: File): Promise<FileParseResult> {
    try {
      // 暂时返回占位符文本，避免 PDF 解析库的兼容性问题
      return {
        fileName: file.name,
        fileType: 'pdf',
        text: 'PDF 文件内容暂时无法自动解析。请使用图片或 Word 文档，或者手动输入内容。',
        extractedContent: 'PDF 文件内容暂时无法自动解析。请使用图片或 Word 文档，或者手动输入内容。',
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
