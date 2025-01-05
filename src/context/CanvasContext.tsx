import { drawImageOnCanvas, loadImage } from '@utils/canvasUtils';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INPUT_HEIGHT,
  INPUT_WIDTH,
} from '@utils/constants';
import {
  FC,
  ReactNode,
  RefObject,
  createContext,
  useRef,
  useContext,
  ChangeEvent,
  useState,
} from 'react';

type CanvasControlContext = {
  ref: RefObject<HTMLDivElement | null>;
  strokes: number;
  reset: () => void;
  undo: () => void;
  save: () => void;
  load: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  getCompoundImage: (
    fill: boolean,
    shrink: boolean
  ) => HTMLCanvasElement | null;
  setStrokes: (value: (prev: number) => number | number) => void;
};

type CanvasControlProviderProps = {
  children: ReactNode;
};

const context = createContext<CanvasControlContext>({} as CanvasControlContext);

export const CanvasControlProvider: FC<CanvasControlProviderProps> = ({
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [strokes, setStrokes] = useState<number>(0);

  const reset = () => {
    if (ref.current) {
      ref.current.innerHTML = '';
      setStrokes(0);
    }
  };

  const undo = () => {
    ref.current?.lastChild?.remove();
    setStrokes((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const save = () => {
    const virtualCanvas = getCompoundImage();

    if (!virtualCanvas) return;
    const link = document.createElement('a');
    link.download = `${crypto.randomUUID()}.png`;
    link.href = virtualCanvas.toDataURL();
    link.click();
  };

  const load = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const image = await loadImage(file);
    const canvas = await drawImageOnCanvas(image);
    setStrokes((prev) => prev + 1);
    ref.current?.append(canvas);
  };

  const getCompoundImage = (fill: boolean = false, shrink: boolean = false) => {
    if (!ref.current) return null;
    const height = shrink ? INPUT_HEIGHT : CANVAS_HEIGHT;
    const width = shrink ? INPUT_WIDTH : CANVAS_WIDTH;

    const virtualCanvas = document.createElement('canvas');
    virtualCanvas.height = height;
    virtualCanvas.width = width;
    const virtualCtx = virtualCanvas.getContext('2d');

    if (!virtualCtx) return null;

    if (fill) {
      virtualCtx.fillStyle = 'black';
      virtualCtx.fillRect(0, 0, virtualCanvas.width, virtualCanvas.height);
    }

    const atomicCanvas = [...ref.current.children] as HTMLCanvasElement[];

    for (const canvas of atomicCanvas) {
      virtualCtx.drawImage(canvas, 0, 0, width, height);
    }
    return virtualCanvas;
  };

  return (
    <context.Provider
      value={{
        ref,
        strokes,
        setStrokes,
        reset,
        undo,
        save,
        load,
        getCompoundImage,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useCanvasControlContext = () => useContext(context);

export default useCanvasControlContext;
