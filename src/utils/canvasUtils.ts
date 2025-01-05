import { Tensor } from 'onnxruntime-web';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INPUT_HEIGHT,
  INPUT_WIDTH,
} from './constants';

export const createCanvas = () => {
  const newCanvas = document.createElement('canvas');
  newCanvas.classList.add('canvas');
  newCanvas.height = CANVAS_HEIGHT;
  newCanvas.width = CANVAS_WIDTH;
  //   const uuid = crypto.randomUUID();
  //   newCanvas.setAttribute("uuid", uuid);
  return newCanvas;
};

export const drawSolidLine = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  context.lineWidth = 16;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = 'white';
  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
};

export const convertCanvasToTensor = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');

  if (!context) return;
  const uintarray = context.getImageData(0, 0, INPUT_WIDTH, INPUT_HEIGHT);
  const grayscaleArray = [];

  for (let i = 0; i < uintarray.data.length; i += 4) {
    grayscaleArray.push(
      (0.299 * uintarray.data[i] +
        0.587 * uintarray.data[i + 1] +
        0.114 * uintarray.data[i + 2]) /
        255.0
    );
  }
  const float32Data = Float32Array.from(grayscaleArray);
  // TODO: resize image to 64x64
  return new Tensor('float32', float32Data, [1, 1, INPUT_HEIGHT, INPUT_WIDTH]);
};

export const loadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export const drawImageOnCanvas = (
  source: string
): Promise<HTMLCanvasElement> => {
  const virtualCanvas = createCanvas();
  const virtualCtx = virtualCanvas.getContext('2d');
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = source;
    img.onload = () => {
      virtualCtx?.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      resolve(virtualCanvas);
    };
    img.onerror = reject;
  });
};
