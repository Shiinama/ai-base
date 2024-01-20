import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { getDocument, getMaskStyle } from '../../utils/guide';
import './index.css';
interface IMask {
  className: string;
  anchorEl: Element;
  realWindow: Window;
}

const Mask: React.FC<IMask> = ({ className, anchorEl, realWindow }): JSX.Element | null => {
  const [style, setStyle] = useState<Record<string, number>>({});
  const timerRef = useRef<number>(0);

  const calculateStyle = useCallback((): void => {
    const style = getMaskStyle(anchorEl);
    setStyle(style);
  }, [anchorEl]);

  const handleResize = useCallback((): void => {
    if (timerRef.current) realWindow.cancelAnimationFrame(timerRef.current);
    timerRef.current = realWindow.requestAnimationFrame(() => {
      calculateStyle();
    });
  }, [calculateStyle, realWindow]);

  useEffect(() => {
    calculateStyle();
  }, [anchorEl, calculateStyle]);

  useEffect((): void | (() => void) => {
    realWindow.addEventListener('resize', handleResize);

    return () => {
      realWindow.removeEventListener('resize', handleResize);
    };
  }, [realWindow, anchorEl, handleResize]);

  if (!anchorEl) return null;

  return ReactDOM.createPortal(<div className={`guide-mask ${className}`} style={style} />, getDocument(anchorEl).body);
};

export default Mask;
