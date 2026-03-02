import { GridDownloadOptions } from '../types/downloadTypes';
import { MappedPixel, PaletteColor } from './pixelation';
import { getColorKeyByHex, ColorSystem } from './colorSystemUtils';

// 用于获取对比色的工具函数
function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  const luma = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return luma > 0.5 ? '#000000' : '#FFFFFF';
}

// 辅助函数：将十六进制颜色转换为RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// 导出CSV hex数据的函数
export function exportCsvData({
  mappedPixelData,
  gridDimensions,
  selectedColorSystem
}: {
  mappedPixelData: MappedPixel[][] | null;
  gridDimensions: { N: number; M: number } | null;
  selectedColorSystem: ColorSystem;
}): void {
  if (!mappedPixelData || !gridDimensions) {
    console.error("导出失败: 映射数据或尺寸无效。");
    alert("无法导出CSV，数据未生成或无效。");
    return;
  }

  const { N, M } = gridDimensions;
  const csvLines: string[] = [];
  
  for (let row = 0; row < M; row++) {
    const rowData: string[] = [];
    for (let col = 0; col < N; col++) {
      const cellData = mappedPixelData[row][col];
      if (cellData && !cellData.isExternal) {
        rowData.push(cellData.color);
      } else {
        rowData.push('TRANSPARENT');
      }
    }
    csvLines.push(rowData.join(','));
  }

  const csvContent = csvLines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `bead-pattern-${N}x${M}-${selectedColorSystem}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log("CSV数据导出完成");
}

// 导出物料清单为Excel格式（CSV）
export function exportMaterialList({
  colorCounts,
  selectedColorSystem,
  excludedColorKeys
}: {
  colorCounts: { [key: string]: { count: number; color: string } } | null;
  totalBeadCount: number;
  selectedColorSystem: ColorSystem;
  excludedColorKeys: Set<string>;
}): void {
  if (!colorCounts) {
    console.error("导出失败: 颜色统计数据无效。");
    alert("无法导出物料清单，数据未生成或无效。");
    return;
  }

  // 创建CSV内容，添加BOM以支持Excel正确显示中文
  const BOM = '\uFEFF';
  const headers = ['色号', '颜色代码', '数量（颗）'];
  const csvLines: string[] = [headers.join(',')];
  
  // 过滤掉已排除的颜色，然后按数量降序排序
  const sortedColors = Object.entries(colorCounts)
    .filter(([hexColor]) => !excludedColorKeys.has(hexColor.toUpperCase()))
    .sort((a, b) => b[1].count - a[1].count);
  
  // 计算未排除颜色的总数
  let actualTotal = 0;
  
  sortedColors.forEach(([hexColor, data]) => {
    const displayKey = getColorKeyByHex(hexColor, selectedColorSystem);
    const row = [displayKey, hexColor, data.count.toString()];
    csvLines.push(row.join(','));
    actualTotal += data.count;
  });
  
  // 添加总计行
  csvLines.push('');
  csvLines.push(`总计,,${actualTotal}`);
  
  const csvContent = BOM + csvLines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `拼豆物料清单-${selectedColorSystem}-${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log("物料清单导出完成");
}

// 导入CSV hex数据的函数
export function importCsvData(file: File): Promise<{
  mappedPixelData: MappedPixel[][];
  gridDimensions: { N: number; M: number };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          reject(new Error('无法读取文件内容'));
          return;
        }
        
        const lines = text.trim().split('\n');
        const M = lines.length;
        
        if (M === 0) {
          reject(new Error('CSV文件为空'));
          return;
        }
        
        const firstRowData = lines[0].split(',');
        const N = firstRowData.length;
        
        if (N === 0) {
          reject(new Error('CSV文件格式无效'));
          return;
        }
        
        const mappedPixelData: MappedPixel[][] = [];
        
        for (let row = 0; row < M; row++) {
          const rowData = lines[row].split(',');
          const mappedRow: MappedPixel[] = [];
          
          if (rowData.length !== N) {
            reject(new Error(`第${row + 1}行的列数不匹配，期望${N}列，实际${rowData.length}列`));
            return;
          }
          
          for (let col = 0; col < N; col++) {
            const cellValue = rowData[col].trim();
            
            if (cellValue === 'TRANSPARENT' || cellValue === '') {
              mappedRow.push({
                key: 'TRANSPARENT',
                color: '#FFFFFF',
                isExternal: true
              });
            } else {
              const hexPattern = /^#[0-9A-Fa-f]{6}$/;
              if (!hexPattern.test(cellValue)) {
                reject(new Error(`第${row + 1}行第${col + 1}列的颜色值无效：${cellValue}`));
                return;
              }
              
              mappedRow.push({
                key: cellValue.toUpperCase(),
                color: cellValue.toUpperCase(),
                isExternal: false
              });
            }
          }
          
          mappedPixelData.push(mappedRow);
        }
        
        resolve({
          mappedPixelData,
          gridDimensions: { N, M }
        });
        
      } catch (error) {
        reject(new Error(`解析CSV文件失败：${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file, 'utf-8');
  });
}

// 下载简洁版图片（只有网格和水印）
export async function downloadSimpleImage({
  mappedPixelData,
  gridDimensions,
  options,
  selectedColorSystem
}: {
  mappedPixelData: MappedPixel[][] | null;
  gridDimensions: { N: number; M: number } | null;
  colorCounts: { [key: string]: { count: number; color: string } } | null;
  totalBeadCount: number;
  options: GridDownloadOptions;
  activeBeadPalette: PaletteColor[];
  selectedColorSystem: ColorSystem;
}): Promise<void> {
  if (!mappedPixelData || !gridDimensions || gridDimensions.N === 0 || gridDimensions.M === 0) {
    console.error("下载失败: 映射数据或尺寸无效。");
    alert("无法下载图纸，数据未生成或无效。");
    return;
  }

  const { N, M } = gridDimensions;
  const downloadCellSize = 30;
  const { showGrid, showCellNumbers = true } = options;

  // 坐标轴边距
  const coordinateMargin = 40;
  const gridWidth = N * downloadCellSize;
  const gridHeight = M * downloadCellSize;
  
  const downloadCanvas = document.createElement('canvas');
  downloadCanvas.width = gridWidth + coordinateMargin * 2;
  downloadCanvas.height = gridHeight + coordinateMargin * 2;
  const context = downloadCanvas.getContext('2d');

  if (!context) {
    console.error("无法获取Canvas上下文。");
    alert("无法下载图纸，Canvas初始化失败。");
    return;
  }

  // 白色背景
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

  // 绘制坐标轴
  const gridStartX = coordinateMargin;
  const gridStartY = coordinateMargin;
  
  context.fillStyle = '#666666';
  context.font = '12px Arial';
  
  // 绘制列坐标（顶部和底部）
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (let i = 0; i < N; i++) {
    if (i % 5 === 0 || i === N - 1) {
      const x = gridStartX + i * downloadCellSize + downloadCellSize / 2;
      // 顶部
      context.fillText((i + 1).toString(), x, 20);
      // 底部
      context.fillText((i + 1).toString(), x, gridStartY + gridHeight + 20);
    }
  }
  
  // 绘制行坐标（左侧和右侧）
  context.textBaseline = 'middle';
  for (let j = 0; j < M; j++) {
    if (j % 5 === 0 || j === M - 1) {
      const y = gridStartY + j * downloadCellSize + downloadCellSize / 2;
      // 左侧
      context.textAlign = 'right';
      context.fillText((j + 1).toString(), gridStartX - 10, y);
      // 右侧
      context.textAlign = 'left';
      context.fillText((j + 1).toString(), gridStartX + gridWidth + 10, y);
    }
  }

  // 绘制网格
  for (let j = 0; j < M; j++) {
    for (let i = 0; i < N; i++) {
      const cell = mappedPixelData[j][i];
      if (!cell || cell.isExternal) continue;

      const x = gridStartX + i * downloadCellSize;
      const y = gridStartY + j * downloadCellSize;

      context.fillStyle = cell.color;
      context.fillRect(x, y, downloadCellSize, downloadCellSize);

      if (showGrid) {
        context.strokeStyle = '#333333';
        context.lineWidth = 1;
        context.strokeRect(x, y, downloadCellSize, downloadCellSize);
      }

      if (showCellNumbers) {
        const displayKey = getColorKeyByHex(cell.color, selectedColorSystem);
        const contrastColor = getContrastColor(cell.color);
        
        context.fillStyle = contrastColor;
        context.font = `bold ${Math.floor(downloadCellSize * 0.35)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(displayKey, x + downloadCellSize / 2, y + downloadCellSize / 2);
      }
    }
  }

  // 添加水印
  const watermarkFontSize = Math.max(20, Math.floor(downloadCellSize * 0.8));
  context.font = `600 ${watermarkFontSize}px Arial`;
  context.fillStyle = 'rgba(0, 0, 0, 0.15)';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('dazhu', gridStartX + gridWidth / 2, gridStartY + gridHeight / 2);

  // 添加色号系统标识（底部右侧，更明显）
  context.font = 'bold 18px Arial';
  context.fillStyle = '#333333';
  context.textAlign = 'right';
  context.textBaseline = 'bottom';
  context.fillText(`色号系统: ${selectedColorSystem}`, downloadCanvas.width - 10, downloadCanvas.height - 10);

  downloadCanvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pixel-art-simple-${N}x${M}.png`;
      link.click();
      URL.revokeObjectURL(url);
      console.log("简洁版图纸下载完成");
    } else {
      console.error("无法生成图片Blob。");
      alert("下载失败，无法生成图片。");
    }
  }, 'image/png');
}

// 下载完整版图片（带标题和统计）
export async function downloadImage({
  mappedPixelData,
  gridDimensions,
  colorCounts,
  totalBeadCount,
  options,
  selectedColorSystem
}: {
  mappedPixelData: MappedPixel[][] | null;
  gridDimensions: { N: number; M: number } | null;
  colorCounts: { [key: string]: { count: number; color: string } } | null;
  totalBeadCount: number;
  options: GridDownloadOptions;
  activeBeadPalette: PaletteColor[];
  selectedColorSystem: ColorSystem;
}): Promise<void> {
  if (!mappedPixelData || !gridDimensions || gridDimensions.N === 0 || gridDimensions.M === 0) {
    console.error("下载失败: 映射数据或尺寸无效。");
    alert("无法下载图纸，数据未生成或无效。");
    return;
  }
  if (!colorCounts) {
    console.error("下载失败: 色号统计数据无效。");
    alert("无法下载图纸，色号统计数据未生成或无效。");
    return;
  }

  const { N, M } = gridDimensions;
  const downloadCellSize = 30;
  const { showGrid, showCellNumbers = true, showCoordinates = true } = options;

  // 计算尺寸
  const coordinateMargin = showCoordinates ? 40 : 0; // 坐标轴边距
  const gridWidth = N * downloadCellSize;
  const gridHeight = M * downloadCellSize;
  const titleBarHeight = 80;
  
  // 动态计算统计区域高度
  const colors = Object.entries(colorCounts).sort((a, b) => b[1].count - a[1].count);
  const colsPerRow = 3;
  const itemHeight = 35;
  const statsRows = Math.ceil(colors.length / colsPerRow);
  const statsHeight = 100 + statsRows * itemHeight; // 标题60 + 颜色列表 + 底部40
  
  const downloadWidth = gridWidth + coordinateMargin * 2;
  const downloadHeight = titleBarHeight + gridHeight + coordinateMargin * 2 + statsHeight;

  const downloadCanvas = document.createElement('canvas');
  downloadCanvas.width = downloadWidth;
  downloadCanvas.height = downloadHeight;
  const context = downloadCanvas.getContext('2d');

  if (!context) {
    console.error("无法获取Canvas上下文。");
    alert("无法下载图纸，Canvas初始化失败。");
    return;
  }

  // 白色背景
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, downloadWidth, downloadHeight);

  // 绘制标题栏
  context.fillStyle = '#4A90E2';
  context.fillRect(0, 0, downloadWidth, titleBarHeight);
  
  context.fillStyle = '#FFFFFF';
  context.font = 'bold 32px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('拼豆图纸生成器', downloadWidth / 2, titleBarHeight * 0.5);

  // 绘制坐标轴（上下左右四个方向）
  const gridStartX = coordinateMargin;
  const gridStartY = titleBarHeight + coordinateMargin;
  
  if (showCoordinates) {
    context.fillStyle = '#666666';
    context.font = '12px Arial';
    
    // 绘制列坐标（顶部和底部）
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (let i = 0; i < N; i++) {
      if (i % 5 === 0 || i === N - 1) {
        const x = gridStartX + i * downloadCellSize + downloadCellSize / 2;
        // 顶部
        context.fillText((i + 1).toString(), x, titleBarHeight + 20);
        // 底部
        context.fillText((i + 1).toString(), x, gridStartY + gridHeight + 20);
      }
    }
    
    // 绘制行坐标（左侧和右侧）
    context.textBaseline = 'middle';
    for (let j = 0; j < M; j++) {
      if (j % 5 === 0 || j === M - 1) {
        const y = gridStartY + j * downloadCellSize + downloadCellSize / 2;
        // 左侧
        context.textAlign = 'right';
        context.fillText((j + 1).toString(), gridStartX - 10, y);
        // 右侧
        context.textAlign = 'left';
        context.fillText((j + 1).toString(), gridStartX + gridWidth + 10, y);
      }
    }
  }

  // 绘制网格
  for (let j = 0; j < M; j++) {
    for (let i = 0; i < N; i++) {
      const cell = mappedPixelData[j][i];
      if (!cell || cell.isExternal) continue;

      const x = gridStartX + i * downloadCellSize;
      const y = gridStartY + j * downloadCellSize;

      context.fillStyle = cell.color;
      context.fillRect(x, y, downloadCellSize, downloadCellSize);

      if (showGrid) {
        context.strokeStyle = '#333333';
        context.lineWidth = 1;
        context.strokeRect(x, y, downloadCellSize, downloadCellSize);
      }

      if (showCellNumbers) {
        const displayKey = getColorKeyByHex(cell.color, selectedColorSystem);
        const contrastColor = getContrastColor(cell.color);
        
        context.fillStyle = contrastColor;
        context.font = `bold ${Math.floor(downloadCellSize * 0.35)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(displayKey, x + downloadCellSize / 2, y + downloadCellSize / 2);
      }
    }
  }

  // 绘制统计区域
  const statsStartY = gridStartY + gridHeight + coordinateMargin;
  context.fillStyle = '#F5F5F5';
  context.fillRect(0, statsStartY, downloadWidth, statsHeight);
  
  context.fillStyle = '#333333';
  context.font = 'bold 20px Arial';
  context.textAlign = 'left';
  context.fillText('颜色统计', 20, statsStartY + 30);
  
  // 绘制颜色列表
  colors.forEach(([hexColor, data], index) => {
    const row = Math.floor(index / colsPerRow);
    const col = index % colsPerRow;
    const x = col * (downloadWidth / colsPerRow) + 20;
    const y = statsStartY + 60 + row * itemHeight;
    
    // 色块
    context.fillStyle = hexColor;
    context.fillRect(x, y, 25, 25);
    context.strokeStyle = '#333';
    context.lineWidth = 1;
    context.strokeRect(x, y, 25, 25);
    
    // 文字
    const displayKey = getColorKeyByHex(hexColor, selectedColorSystem);
    context.fillStyle = '#333333';
    context.font = '14px Arial';
    context.textAlign = 'left';
    context.fillText(`${displayKey}: ${data.count}颗`, x + 35, y + 17);
  });

  // 总计和水印在同一行，但分开位置
  const bottomY = statsStartY + statsHeight - 30;
  context.font = 'bold 16px Arial';
  context.textAlign = 'left';
  context.fillStyle = '#333333';
  context.fillText(`总计: ${totalBeadCount} 颗`, 20, bottomY);
  
  // 色号系统标识（中间位置，更明显）
  context.font = 'bold 18px Arial';
  context.fillStyle = '#333333';
  context.textAlign = 'center';
  context.fillText(`色号系统: ${selectedColorSystem}`, downloadWidth / 2, bottomY);
  
  // 水印
  context.font = '14px Arial';
  context.fillStyle = 'rgba(0, 0, 0, 0.3)';
  context.textAlign = 'right';
  context.fillText('dazhu', downloadWidth - 20, bottomY);

  downloadCanvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pixel-art-full-${N}x${M}.png`;
      link.click();
      URL.revokeObjectURL(url);
      console.log("完整版图纸下载完成");
    } else {
      console.error("无法生成图片Blob。");
      alert("下载失败，无法生成图片。");
    }
  }, 'image/png');
}
