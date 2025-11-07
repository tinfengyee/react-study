import type { ReactNode } from 'react';
import { useState, useRef } from 'react';
import Tooltip from './Tooltip';

interface DOMRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface ButtonWithTooltipProps {
  tooltipContent: ReactNode;
  children: ReactNode;
}

export default function ButtonWithTooltip({ tooltipContent, children }: ButtonWithTooltipProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  console.log('targetRect :>> ', targetRect);
  return (
    <>
      <button
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current?.getBoundingClientRect();
          if (rect) {
            setTargetRect({
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
            });
          }
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      >
        {children}
      </button>
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )}
    </>
  );
}
