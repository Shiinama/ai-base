import useProfileStore from '../store/ProfileStore';
import { throttle } from 'lodash-es';
import { useCallback, useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const useResize = () => {
  const { setWidth, setHeight } = useProfileStore((state) => ({
    setWidth: state.setWidth,
    setHeight: state.setHeight,
  }));

  const resizeHandler = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setWidth(width);
    setHeight(height);
  }, [setHeight, setWidth]);

  useIsomorphicLayoutEffect(() => {
    let timer: number | undefined;
    function resize() {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(resizeHandler);
      } else {
        timer = setTimeout(resizeHandler, 66) as unknown as number;
      }
    }

    resize();
    window.addEventListener('resize', throttle(resize, 500));

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resize);
    };
  }, [resizeHandler]);
};

export default useResize;
