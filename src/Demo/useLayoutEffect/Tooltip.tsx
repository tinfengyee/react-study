import type { ReactNode } from 'react';
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer';

interface DOMRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface TooltipProps {
  children: ReactNode;
  targetRect: DOMRect | null;
}

export default function Tooltip({ children, targetRect }: TooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  console.log('tooltipHeight :>> ', tooltipHeight);
  useLayoutEffect(() => {
    const height = ref.current?.getBoundingClientRect().height;
    console.log('height :>> ', height);
    if (height !== undefined) {
      setTooltipHeight(height);
    }
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 它不适合上方，因此把它放在下面。
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
