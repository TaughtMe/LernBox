// src/components/common/SafeHtmlRenderer.tsx
import React from 'react'
import { sanitizeHtml } from '../../utils/sanitizeHtml'

type SafeHtmlRendererProps = {
  htmlContent: string
  className?: string
  ariaLabel?: string
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({
  htmlContent,
  className,
  ariaLabel,
}) => {
  const safe = sanitizeHtml(htmlContent || '')
  return (
    <div
      className={className}
      aria-label={ariaLabel}
      // Sicheres, bereinigtes HTML ausgeben
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}

export default React.memo(SafeHtmlRenderer)
