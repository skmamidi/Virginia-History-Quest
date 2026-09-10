import { useEffect, type ReactNode } from 'react';
// Learning destinations live in document flow. Dialog behavior is reserved for overlays.
export function PageContent({ label, titleId, className = '', children }: {
  label: string; titleId: string; className?: string; children: ReactNode; onClose?: () => void;
}) {
  useEffect(() => {
    const heading = document.getElementById(titleId);
    if (heading) { heading.dataset.pageTitle = 'true'; heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }, [titleId]);
  return <section className={`learning-content ${className}`} aria-label={label} aria-labelledby={titleId}>{children}</section>;
}
