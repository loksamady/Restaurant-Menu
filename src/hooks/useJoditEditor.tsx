/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef } from "react";

function useJoditEditor(): any {
  const editorRef = useRef(null);

  const buttons: string[] = [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "eraser",
    "ul",
    "ol",
    "font",
    "fontsize",
    "paragraph",
    "lineHeight",
    "superscript",
    "subscript",
    "classSpan",
    "image",
    "hr",
    "table",
    "link",
    "symbols",
    "source",
  ];

  const editorConfig: any = useMemo(
    () => ({
      placeholder: "Start typing...",
      useSearch: false,
      uploader: { insertImageAsBase64URI: true },
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    []
  );

  return { editorRef, buttons, editorConfig };
}

export default useJoditEditor;
