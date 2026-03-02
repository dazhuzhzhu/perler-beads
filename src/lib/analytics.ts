// Google Analytics 事件追踪
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// 页面浏览
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// 自定义事件
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 预定义的事件追踪函数
export const trackImageUpload = (fileSize: number) => {
  event({
    action: 'upload_image',
    category: 'Image',
    label: 'Image Upload',
    value: fileSize,
  });
};

export const trackPixelation = (gridSize: string) => {
  event({
    action: 'generate_pixel_art',
    category: 'Generation',
    label: gridSize,
  });
};

export const trackDownload = (type: 'simple' | 'full') => {
  event({
    action: 'download_image',
    category: 'Download',
    label: type,
  });
};

export const trackExportMaterialList = (colorSystem: string) => {
  event({
    action: 'export_material_list',
    category: 'Export',
    label: colorSystem,
  });
};

export const trackColorSystemChange = (colorSystem: string) => {
  event({
    action: 'change_color_system',
    category: 'Settings',
    label: colorSystem,
  });
};

// TypeScript 类型声明
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}
