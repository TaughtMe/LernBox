import DOMPurify from "dompurify"
import type { FC } from "react"

export type SafeHtmlRendererProps = {
  htmlContent: string
  className?: string
}

const SafeHtmlRenderer: FC<SafeHtmlRendererProps> = ({ htmlContent, className }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent)
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export default SafeHtmlRenderer
