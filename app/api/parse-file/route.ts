import { NextRequest, NextResponse } from 'next/server';
import { FileParser } from '../../../lib/file/parser';
import { GLMService } from '../../../lib/ai/glm';
import { DeepSeekService } from '../../../lib/ai/deepseek';

/**
 * POST /api/parse-file
 * 解析上传的文件并生成内容植入方向建议
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const model = formData.get('model') as string || 'glm-4';

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }

    // 添加调试信息
    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // 解析文件内容
    const parseResult = await FileParser.parseFile(file);

    // 使用 AI 提取 brief 并生成建议
    let aiService;
    const apiKey = model === 'glm-4' ? process.env.GLM_API_KEY : process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: `API key not configured for model: ${model}`,
        },
        { status: 400 }
      );
    }

    if (model === 'glm-4') {
      aiService = new GLMService(apiKey);
    } else if (model === 'deepseek-v3') {
      aiService = new DeepSeekService(apiKey);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported model: ${model}`,
        },
        { status: 400 }
      );
    }

    // 调用 AI 解析 brief
    const aiResult = await aiService.parseBrief(parseResult.text);

    return NextResponse.json({
      success: true,
      data: {
        file: parseResult,
        extractedContent: aiResult.extractedContent,
        suggestions: aiResult.suggestions,
      },
    });
  } catch (error: any) {
    console.error('Parse file API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to parse file',
      },
      { status: 500 }
    );
  }
}
