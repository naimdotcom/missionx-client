// import * as React from 'react';

// interface InfiniteScrollProps {
//   isLoading: boolean;
//   hasMore: boolean;
//   next: () => unknown;
//   threshold?: number;
//   root?: Element | Document | null;
//   rootMargin?: string;
//   reverse?: boolean;
//   children?: React.ReactNode;
// }

// export default function InfiniteScroll({
//   isLoading,
//   hasMore,
//   next,
//   threshold = 1,
//   root = null,
//   rootMargin = '0px',
//   reverse,
//   children,
// }: InfiniteScrollProps) {
//   const observer = React.useRef<IntersectionObserver>();
//   // This callback ref will be called when it is dispatched to an element or detached from an element,
//   // or when the callback function changes.
//   const observerRef = React.useCallback(
//     (element: HTMLElement | null) => {
//       let safeThreshold = threshold;
//       if (threshold < 0 || threshold > 1) {
//         console.warn(
//           'threshold should be between 0 and 1. You are exceed the range. will use default value: 1',
//         );
//         safeThreshold = 1;
//       }
//       // When isLoading is true, this callback will do nothing.
//       // It means that the next function will never be called.
//       // It is safe because the intersection observer has disconnected the previous element.
//       if (isLoading) return;

//       if (observer.current) observer.current.disconnect();
//       if (!element) return;

//       // Create a new IntersectionObserver instance because hasMore or next may be changed.
//       observer.current = new IntersectionObserver(
//         (entries) => {
//           if (entries[0].isIntersecting && hasMore) {
//             next();
//           }
//         },
//         { threshold: safeThreshold, root, rootMargin },
//       );
//       observer.current.observe(element);
//     },
//     [hasMore, isLoading, next, threshold, root, rootMargin],
//   );

//   const flattenChildren = React.useMemo(() => React.Children.toArray(children), [children]);

//   return (
//     <>
//       {flattenChildren.map((child, index) => {
//         if (!React.isValidElement(child)) {
//           process.env.NODE_ENV === 'development' &&
//             console.warn('You should use a valid element with InfiniteScroll');
//           return child;
//         }

//         const isObserveTarget = reverse ? index === 0 : index === flattenChildren.length - 1;
//         const ref = isObserveTarget ? observerRef : null;
//         // @ts-ignore ignore ref type
//         return React.cloneElement(child, { ref });
//       })}
//     </>
//   );
// }

import * as React from "react";

interface InfiniteScrollProps {
  isLoading: boolean;
  hasMore: boolean;
  next: () => unknown;
  threshold?: number;
  root?: Element | Document | null;
  rootMargin?: string;
  reverse?: boolean;
  children?: React.ReactNode;
}

/**
 * Sentinel-based infinite scroll.
 *
 * The IntersectionObserver is created ONCE per sentinel element mount.
 * `hasMore`, `isLoading`, and `next` are stored in refs so the observer
 * never needs to be torn down and recreated when they change — which was
 * the cause of the double-fetch bug (observer recreated while sentinel was
 * still visible → immediate second fire).
 */
export default function InfiniteScroll({
  isLoading,
  hasMore,
  next,
  threshold = 1,
  root = null,
  rootMargin = "0px",
  reverse,
  children,
}: InfiniteScrollProps) {
  // Keep latest values accessible inside the stable observer callback
  const hasMoreRef = React.useRef(hasMore);
  const isLoadingRef = React.useRef(isLoading);
  const nextRef = React.useRef(next);
  hasMoreRef.current = hasMore;
  isLoadingRef.current = isLoading;
  nextRef.current = next;

  const observerRef = React.useRef<IntersectionObserver | null>(null);

  // Callback ref — runs when the sentinel mounts/unmounts.
  // Does NOT depend on hasMore/isLoading/next so the observer is never
  // recreated mid-scroll; it just reads the latest values via refs.
  const sentinelRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!element) return;

      let safeThreshold = threshold;
      if (threshold < 0 || threshold > 1) safeThreshold = 1;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting &&
            hasMoreRef.current &&
            !isLoadingRef.current
          ) {
            nextRef.current();
          }
        },
        { threshold: safeThreshold, root, rootMargin },
      );
      observerRef.current.observe(element);
    },
    // Only structural observer options — NOT hasMore/isLoading/next
    [threshold, root, rootMargin],
  );

  const sentinel = <div ref={sentinelRef} style={{ height: 1 }} />;

  return (
    <>
      {reverse && sentinel}
      {children}
      {!reverse && sentinel}
    </>
  );
}
