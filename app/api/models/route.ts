import { NextResponse } from 'next/server';
import { ModelConfig } from '../../../types/script';

/**
 * GET /api/models
 * 获取可用的 AI 模型列表
 */
export async function GET() {
  try {
    // 从环境变量读取模型配置
    const models: ModelConfig[] = [
      {
        id: 'glm-4',
        name: 'GLM-4',
        description: '智谱AI GLM-4 模型，适合中文内容创作',
        enabled: !!process.env.GLM_API_KEY,
      },
      {
        id: 'deepseek-v3',
        name: 'DeepSeek-V3',
        description: '深度求索 DeepSeek-V3 模型，高性能大模型',
        enabled: !!process.env.DEEPSEEK_API_KEY,
      },
    ];

    // 过滤出已启用（有 API Key）的模型
    const enabledModels = models.filter(model => model.enabled);

    if (enabledModels.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No AI models available. Please configure API keys in environment variables.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enabledModels,
    });
  } catch (error: any) {
    console.error('Models API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
