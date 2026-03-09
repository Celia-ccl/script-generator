import { NextRequest, NextResponse } from 'next/server';
import { GLMService } from '../../../lib/ai/glm';
import { DeepSeekService } from '../../../lib/ai/deepseek';

/**
 * POST /api/generate
 * 生成 Vlog 脚本
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      model = 'glm-4',
      theme,
      customTheme,
      style,
      duration,
      notes,
      bloggerId,
      profileUrl,
      selectedDirection,
    } = body;

    // 验证必要参数
    if (!theme || !style || !duration || !selectedDirection) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: theme, style, duration, selectedDirection',
        },
        { status: 400 }
      );
    }

    // 获取 API Key
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

    // 创建 AI 服务实例
    let aiService;
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

    // 构建请求参数
    const generateRequest = {
      model,
      theme,
      customTheme,
      style,
      duration,
      notes,
      bloggerId,
      profileUrl,
    };

    // 生成脚本
    const scriptData = await aiService.generateScript(generateRequest, selectedDirection);

    return NextResponse.json({
      success: true,
      data: scriptData,
    });
  } catch (error: any) {
    console.error('Generate script API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate script',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/generate
 * 重新生成脚本（部分或全部）
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      model = 'glm-4',
      scriptData,
      sceneNumber,
      reason,
      direction,
    } = body;

    // 验证必要参数
    if (!scriptData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: scriptData',
        },
        { status: 400 }
      );
    }

    // 获取 API Key
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

    // 创建 AI 服务实例
    let aiService;
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

    // 重新生成脚本
    const newScriptData = await aiService.regenerateScript(
      scriptData,
      sceneNumber,
      reason,
      direction
    );

    return NextResponse.json({
      success: true,
      data: newScriptData,
    });
  } catch (error: any) {
    console.error('Regenerate script API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to regenerate script',
      },
      { status: 500 }
    );
  }
}
