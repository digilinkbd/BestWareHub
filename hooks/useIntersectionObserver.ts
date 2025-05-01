"use client"
import { useState, useEffect, RefObject } from 'react';

interface UseIntersectionObserverProps {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

export default function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    enabled = true,
  }: UseIntersectionObserverProps = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    const element = elementRef.current;
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, enabled, elementRef]);

  return isIntersecting;
}