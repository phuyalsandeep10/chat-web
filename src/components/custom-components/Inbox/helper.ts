export const debounceFocus = (editorRef: any) => {
  if (editorRef.current) {
    setTimeout(() => {
      editorRef.current.focus();
    }, 500);
  }
};
