import DOMPurify from 'dompurify';
import React from 'react';

interface SafeHtmlRendererProps {
  htmlContent: string;
  className?: string;
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ htmlContent, className }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHtmlRenderer;