'use client';

import React, { useState, useRef, useEffect, TouchEvent, MouseEvent } from 'react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageSrc: string) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | 'move' | null;

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [activeHandle, setActiveHandle] = useState<ResizeHandle>(null);

  // 加载图片
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      
      // 计算画布大小（适应屏幕）
      const maxWidth = Math.min(window.innerWidth - 40, 600);
      const maxHeight = Math.min(window.innerHeight - 300, 500);
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      setCanvasSize({ width, height });
      
      // 初始裁切区域（80%的图片）
      const margin = 0.1;
      setCropArea({
        x: width * margin,
        y: height * margin,
        width: width * (1 - margin * 2),
        height: height * (1 - margin * 2),
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // 绘制画布
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // 绘制图片
    ctx.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
    
    // 绘制遮罩
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    
    // 清除裁切区域
    ctx.clearRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    ctx.drawImage(
      image,
      (cropArea.x / canvasSize.width) * image.width,
      (cropArea.y / canvasSize.height) * image.height,
      (cropArea.width / canvasSize.width) * image.width,
      (cropArea.height / canvasSize.height) * image.height,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height
    );
    
    // 绘制裁切框
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    
    // 绘制角落控制点
    const handleSize = 20;
    ctx.fillStyle = '#fff';
    // 左上
    ctx.fillRect(cropArea.x - handleSize / 2, cropArea.y - handleSize / 2, handleSize, handleSize);
    // 右上
    ctx.fillRect(cropArea.x + cropArea.width - handleSize / 2, cropArea.y - handleSize / 2, handleSize, handleSize);
    // 左下
    ctx.fillRect(cropArea.x - handleSize / 2, cropArea.y + cropArea.height - handleSize / 2, handleSize, handleSize);
    // 右下
    ctx.fillRect(cropArea.x + cropArea.width - handleSize / 2, cropArea.y + cropArea.height - handleSize / 2, handleSize, handleSize);
  }, [image, cropArea, canvasSize]);

  // 检测点击的是哪个控制点或区域
  const getHandleAtPosition = (x: number, y: number): ResizeHandle => {
    const handleSize = 20;
    const tolerance = 10;
    
    // 检查四个角
    if (Math.abs(x - cropArea.x) < handleSize + tolerance && Math.abs(y - cropArea.y) < handleSize + tolerance) {
      return 'tl'; // 左上角
    }
    if (Math.abs(x - (cropArea.x + cropArea.width)) < handleSize + tolerance && Math.abs(y - cropArea.y) < handleSize + tolerance) {
      return 'tr'; // 右上角
    }
    if (Math.abs(x - cropArea.x) < handleSize + tolerance && Math.abs(y - (cropArea.y + cropArea.height)) < handleSize + tolerance) {
      return 'bl'; // 左下角
    }
    if (Math.abs(x - (cropArea.x + cropArea.width)) < handleSize + tolerance && Math.abs(y - (cropArea.y + cropArea.height)) < handleSize + tolerance) {
      return 'br'; // 右下角
    }
    
    // 检查是否在裁切区域内（移动）
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      return 'move';
    }
    
    return null;
  };

  // 处理拖动开始
  const handleDragStart = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const handle = getHandleAtPosition(x, y);
    if (handle) {
      setIsDragging(true);
      setActiveHandle(handle);
      setDragStart({ x, y });
    }
  };

  // 处理拖动
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !canvasRef.current || !activeHandle) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    const minSize = 50; // 最小裁切尺寸
    
    if (activeHandle === 'move') {
      // 移动裁切框
      let newX = cropArea.x + deltaX;
      let newY = cropArea.y + deltaY;
      
      // 限制在画布内
      newX = Math.max(0, Math.min(newX, canvasSize.width - cropArea.width));
      newY = Math.max(0, Math.min(newY, canvasSize.height - cropArea.height));
      
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
      setDragStart({ x, y });
    } else {
      // 调整裁切框大小
      let updatedCropArea = { ...cropArea };
      
      if (activeHandle === 'tl') {
        // 左上角
        const newWidth = cropArea.width - deltaX;
        const newHeight = cropArea.height - deltaY;
        if (newWidth >= minSize && cropArea.x + deltaX >= 0) {
          updatedCropArea.x = cropArea.x + deltaX;
          updatedCropArea.width = newWidth;
        }
        if (newHeight >= minSize && cropArea.y + deltaY >= 0) {
          updatedCropArea.y = cropArea.y + deltaY;
          updatedCropArea.height = newHeight;
        }
      } else if (activeHandle === 'tr') {
        // 右上角
        const newWidth = cropArea.width + deltaX;
        const newHeight = cropArea.height - deltaY;
        if (newWidth >= minSize && cropArea.x + newWidth <= canvasSize.width) {
          updatedCropArea.width = newWidth;
        }
        if (newHeight >= minSize && cropArea.y + deltaY >= 0) {
          updatedCropArea.y = cropArea.y + deltaY;
          updatedCropArea.height = newHeight;
        }
      } else if (activeHandle === 'bl') {
        // 左下角
        const newWidth = cropArea.width - deltaX;
        const newHeight = cropArea.height + deltaY;
        if (newWidth >= minSize && cropArea.x + deltaX >= 0) {
          updatedCropArea.x = cropArea.x + deltaX;
          updatedCropArea.width = newWidth;
        }
        if (newHeight >= minSize && cropArea.y + newHeight <= canvasSize.height) {
          updatedCropArea.height = newHeight;
        }
      } else if (activeHandle === 'br') {
        // 右下角
        const newWidth = cropArea.width + deltaX;
        const newHeight = cropArea.height + deltaY;
        if (newWidth >= minSize && cropArea.x + newWidth <= canvasSize.width) {
          updatedCropArea.width = newWidth;
        }
        if (newHeight >= minSize && cropArea.y + newHeight <= canvasSize.height) {
          updatedCropArea.height = newHeight;
        }
      }
      
      setCropArea(updatedCropArea);
      setDragStart({ x, y });
    }
  };

  // 鼠标事件
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  // 触摸事件
  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  // 确认裁切
  const handleConfirm = () => {
    if (!image) return;
    
    // 创建裁切后的图片
    const cropCanvas = document.createElement('canvas');
    const scaleX = image.width / canvasSize.width;
    const scaleY = image.height / canvasSize.height;
    
    cropCanvas.width = cropArea.width * scaleX;
    cropCanvas.height = cropArea.height * scaleY;
    
    const ctx = cropCanvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(
      image,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      cropCanvas.width,
      cropCanvas.height
    );
    
    onCropComplete(cropCanvas.toDataURL('image/png'));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl p-4 max-w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          裁切图片
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 text-center">
          拖动白框移动位置，拖动四角调整大小
        </p>
        
        <div className="flex justify-center mb-3">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="border border-gray-300 rounded cursor-move touch-none"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors"
          >
            确认裁切
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
