import * as XLSX from 'xlsx';
import { ScriptData, ScriptScene } from '@/types/script';

/**
 * Excel 导出工具类
 * 将脚本数据导出为可编辑的 Excel 文件
 */
export class ExcelExporter {
  /**
   * 导出脚本为 Excel 文件
   */
  static exportScript(scriptData: ScriptData): void {
    // 创建工作簿
    const workbook = XLSX.utils.book_new();

    // 1. 脚本基本信息工作表
    const infoSheetData = [
      ['脚本基本信息'],
      [''],
      ['博主ID', scriptData.bloggerId],
      ['主页链接', scriptData.profileUrl],
      ['合作品牌/产品', scriptData.productName || ''],
      ['Vlog标题', scriptData.title],
      ['预计总时长', `${scriptData.totalDuration}秒`],
      ['封面图片', scriptData.coverImage || ''],
    ];
    const infoSheet = XLSX.utils.aoa_to_sheet(infoSheetData);
    XLSX.utils.book_append_sheet(workbook, infoSheet, '基本信息');

    // 2. 发布文案和标签工作表
    const postSheetData = [
      ['发布文案'],
      [scriptData.postContent],
      [''],
      ['标签'],
      ...scriptData.tags.map(tag => [tag]),
    ];
    const postSheet = XLSX.utils.aoa_to_sheet(postSheetData);
    XLSX.utils.book_append_sheet(workbook, postSheet, '发布文案');

    // 3. 脚本正文工作表
    const scriptSheetData = [
      ['镜号', '景别', '时长(秒)', '镜头内容', '口播文案', '备注'],
      ...scriptData.scenes.map((scene: ScriptScene) => [
        scene.sceneNumber,
        this.getShotTypeLabel(scene.shotType),
        scene.duration,
        scene.content,
        scene.narration,
        scene.notes || '',
      ]),
    ];
    const scriptSheet = XLSX.utils.aoa_to_sheet(scriptSheetData);

    // 设置列宽
    scriptSheet['!cols'] = [
      { wch: 6 },   // 镜号
      { wch: 8 },   // 景别
      { wch: 8 },   // 时长
      { wch: 40 },  // 镜头内容
      { wch: 50 },  // 口播文案
      { wch: 30 },  // 备注
    ];

    XLSX.utils.book_append_sheet(workbook, scriptSheet, '脚本正文');

    // 4. 开场和结束语工作表
    const introSheetData = [
      ['开场文案'],
      [scriptData.preview],
      [''],
      ['结束文案'],
      [scriptData.ending],
    ];
    const introSheet = XLSX.utils.aoa_to_sheet(introSheetData);
    XLSX.utils.book_append_sheet(workbook, introSheet, '开场/结束');

    // 生成文件名
    const fileName = `${scriptData.title}_${new Date().getTime()}.xlsx`;

    // 下载文件
    XLSX.writeFile(workbook, fileName);
  }

  /**
   * 获取景别标签
   */
  private static getShotTypeLabel(shotType: string): string {
    const labels: Record<string, string> = {
      wide: '远景',
      medium: '中景',
      'close-up': '近景',
    };
    return labels[shotType] || shotType;
  }

  /**
   * 导出脚本为 CSV 文件（简化版）
   */
  static exportScriptToCSV(scriptData: ScriptData): void {
    const csvData = [
      ['镜号', '景别', '时长(秒)', '镜头内容', '口播文案', '备注'],
      ...scriptData.scenes.map((scene: ScriptScene) => [
        scene.sceneNumber,
        this.getShotTypeLabel(scene.shotType),
        scene.duration,
        scene.content,
        scene.narration,
        scene.notes || '',
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    // 创建 Blob 并下载
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${scriptData.title}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
