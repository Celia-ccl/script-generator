import axios from 'axios';
import { AIService } from './base';
import {
  AIModel,
  GenerateScriptRequest,
  ScriptData,
  ScriptScene,
  ContentDirection,
} from '@/types/script';

/**
 * GLM-4 AI 服务实现
 */
export class GLMService extends AIService {
  private baseURL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  constructor(apiKey: string) {
    super(apiKey, 'glm-4');
  }

  /**
   * 调用 GLM API
   */
  private async callGLM(messages: any[], temperature = 0.7): Promise<string> {
    try {
      const response = await axios.post(
        this.baseURL,
        {
          model: 'glm-4',
          messages,
          temperature,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('GLM API error:', error.response?.data || error.message);
      throw new Error('AI service error: ' + (error.response?.data?.error?.message || error.message));
    }
  }

  /**
   * 解析文件内容，提取 brief
   */
  async parseBrief(fileText: string): Promise<{
    extractedContent: string;
    suggestions: ContentDirection[];
  }> {
    const prompt = `你是一个专业的 Vlog 内容策划助手。请分析以下 brief 内容，提取关键信息，并给出至少5个内容植入方向建议。

Brief 内容：
${fileText}

请以 JSON 格式返回，包含：
1. extractedContent: 提取的核心内容摘要（100字以内）
2. suggestions: 至少5个内容植入方向，每个方向包含：
   - id: 唯一标识
   - title: 方向标题
   - description: 简短描述
   - keywords: 相关关键词数组

确保返回的是纯 JSON 格式，不要包含 markdown 标记。`;

    const result = await this.callGLM([{ role: 'user', content: prompt }]);

    try {
      const parsed = JSON.parse(result);
      return parsed;
    } catch (error) {
      // 如果解析失败，返回默认值
      return {
        extractedContent: fileText.slice(0, 100),
        suggestions: [
          { id: '1', title: '日常记录', description: '记录真实生活瞬间', keywords: ['真实', '日常'] },
          { id: '2', title: '情感共鸣', description: '引发观众情感共鸣', keywords: ['情感', '共鸣'] },
          { id: '3', title: '实用分享', description: '分享实用技巧或经验', keywords: ['实用', '技巧'] },
          { id: '4', title: '幽默搞怪', description: '增加趣味性和娱乐性', keywords: ['幽默', '搞怪'] },
          { id: '5', title: '治愈疗愈', description: '营造温暖治愈的氛围', keywords: ['治愈', '温暖'] },
        ],
      };
    }
  }

  /**
   * 生成脚本
   */
  async generateScript(request: GenerateScriptRequest, selectedDirection: string): Promise<ScriptData> {
    const { theme, customTheme, style, duration, notes, files, bloggerId, profileUrl } = request;

    const themeName = theme === 'custom' ? customTheme : theme;

    const styleMap = {
      daily: '日常生活风格，自然平实，真实接地气',
      funny: '搞怪抽象风格，幽默有趣，轻松活泼',
      healing: '治愈疗愈风格，温暖舒缓，富有诗意',
    };

    const prompt = `你是一个专业的 Vlog 脚本创作助手。请根据以下信息创作一个完整的 Vlog 脚本。

输入信息：
- 主题：${themeName}
- 口播风格：${styleMap[style]}
- 预计时长：${duration}秒
- 备注：${notes || '无'}
- 内容植入方向：${selectedDirection}
- 博主ID：${bloggerId || '未提供'}
- 主页链接：${profileUrl || '未提供'}

请创作一个符合要求的 Vlog 脚本，要求：

1. 脚本结构：
   - preview（开场文案）：吸引眼球，引导观众继续观看
   - scenes（脚本正文）：包含多个镜头片段，每个片段需要：
     * sceneNumber（镜号，从1开始）
     * shotType（景别：wide远景/medium中景/close-up近景）
     * duration（时长，秒）
     * content（镜头内容描述）
     * narration（口播文案）
     * notes（备注，可选）
   - ending（结束文案）：总结升华，引导关注

2. 时长控制：
   - 所有镜头片段的总时长应接近${duration}秒
   - 每个片段时长合理分配

3. 创意要求：
   - 符合${styleMap[style]}的风格特点
   - 围绕"${selectedDirection}"这个内容植入方向
   - 内容丰富有趣，有吸引力

4. 额外信息：
   - postContent（发布文案）：适合社交媒体发布的短文案
   - tags（标签）：5-8个相关标签

请以 JSON 格式返回完整脚本：
{
  "bloggerId": "博主ID",
  "profileUrl": "主页链接",
  "title": "Vlog标题",
  "postContent": "发布文案",
  "tags": ["标签1", "标签2", ...],
  "totalDuration": 总时长,
  "preview": "开场文案",
  "scenes": [
    {
      "sceneNumber": 1,
      "shotType": "wide",
      "duration": 5,
      "content": "镜头内容",
      "narration": "口播文案"
    }
  ],
  "ending": "结束文案"
}

确保返回的是纯 JSON 格式，不要包含 markdown 标记。`;

    const result = await this.callGLM([{ role: 'user', content: prompt }]);

    try {
      const parsed = JSON.parse(result);
      return {
        ...parsed,
        bloggerId: bloggerId || parsed.bloggerId || '',
        profileUrl: profileUrl || parsed.profileUrl || '',
      };
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * 重新生成脚本（部分或全部）
   */
  async regenerateScript(
    scriptData: ScriptData,
    sceneNumber?: number,
    reason?: string,
    direction?: string
  ): Promise<ScriptData> {
    if (sceneNumber) {
      // 重新生成特定片段
      const scene = scriptData.scenes.find((s) => s.sceneNumber === sceneNumber);
      if (!scene) {
        throw new Error('Scene not found');
      }

      const prompt = `请重新生成以下脚本片段，根据用户反馈进行改进：

原片段：
- 镜号：${scene.sceneNumber}
- 景别：${scene.shotType}
- 时长：${scene.duration}秒
- 镜头内容：${scene.content}
- 口播文案：${scene.narration}

用户不满意的原因：${reason || '未提供'}
改进方向：${direction || '无'}

请生成改进后的片段，以 JSON 格式返回：
{
  "sceneNumber": ${sceneNumber},
  "shotType": "${scene.shotType}",
  "duration": ${scene.duration},
  "content": "新的镜头内容",
  "narration": "新的口播文案"
}`;

      const result = await this.callGLM([{ role: 'user', content: prompt }]);
      const newScene = JSON.parse(result);

      // 更新指定片段
      const updatedScenes = scriptData.scenes.map((s) =>
        s.sceneNumber === sceneNumber ? { ...s, ...newScene } : s
      );

      return { ...scriptData, scenes: updatedScenes };
    } else {
      // 重新生成整个脚本
      const prompt = `请根据以下反馈重新生成整个脚本：

原脚本：
${JSON.stringify(scriptData, null, 2)}

用户不满意的原因：${reason || '未提供'}
改进方向：${direction || '无'}

请重新生成完整的脚本，保持原有的结构和时长，但改进内容质量。

以 JSON 格式返回完整脚本（与原脚本相同的结构）。`;

      const result = await this.callGLM([{ role: 'user', content: prompt }]);
      return JSON.parse(result);
    }
  }

  /**
   * 测试连接
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.callGLM([{ role: 'user', content: '测试连接' }], 0.1);
      return true;
    } catch (error) {
      return false;
    }
  }
}
