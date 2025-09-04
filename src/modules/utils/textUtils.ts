import DOMPurify from 'dompurify';

export const renderHtml = (html: string) => {
  return { __html: DOMPurify.sanitize(html) };
};
