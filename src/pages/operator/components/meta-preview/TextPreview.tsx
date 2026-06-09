interface TextPreviewProps {
  text: string;
}

export function TextPreview({ text }: TextPreviewProps) {
  return (
    <div className="max-w-xs rounded-2xl rounded-tl-sm border border-border bg-white px-3.5 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm dark:bg-gray-900 dark:text-gray-100">
      {text}
    </div>
  );
}
