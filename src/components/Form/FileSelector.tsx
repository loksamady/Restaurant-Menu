import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import { Button } from "primereact/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface FileSelectorProps {
  value: File[];
  iconOnly?: boolean;
  imageOnly?: boolean;
  videoOnly?: boolean;
  maxFiles?: number;
  onChange?: (newFiles: File[]) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  value: files = [],
  iconOnly = false,
  imageOnly = false,
  videoOnly = false,
  maxFiles,
  onChange,
}) => {
  const { t } = useTranslation("site");
  const [error, setError] = useState<string | null>(null);

  const checkAcceptFiles = (acceptedFiles: File[], extensions: string[]) => {
    return acceptedFiles.filter((file) => !extensions.includes(file.type));
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (
      maxFiles !== undefined &&
      files?.length + acceptedFiles?.length > maxFiles
    ) {
      setError(`You can only select up to ${maxFiles} files.`);
      return;
    }

    // Check if all files are either images or PDFs
    const invalidFiles = imageOnly
      ? checkAcceptFiles(acceptedFiles, ["image/jpeg", "image/png"])
      : videoOnly
      ? checkAcceptFiles(acceptedFiles, ["video/mp4", "video/x-ms-wmv"])
      : checkAcceptFiles(acceptedFiles, [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "video/x-ms-wmv",
          "video/mp4",
        ]);

    if (invalidFiles && invalidFiles?.length > 0) {
      setError("Only image and PDF files are allowed.");
      return;
    }
    const totalFiles = [...files, ...acceptedFiles];

    onChange && onChange(totalFiles);
    setError(null);
  };

  const handleRemoveFile = (fileName: string) => {
    const updatedFiles =
      files && files.filter((file) => file.name !== fileName);

    onChange && onChange(updatedFiles);
  };

  const handleClearAll = () => {
    onChange && onChange([]);
    setError(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: imageOnly
      ? { "image/jpeg": [".jpeg"], "image/png": [".png"] }
      : videoOnly
      ? { "video/mp4": [".mp4"], "video/x-ms-wmv": [".wmv"] }
      : {
          "image/jpeg": [".jpeg"],
          "image/png": [".png"],
          "application/pdf": [".pdf"],
          "video/x-ms-wmv": [".wmv"],
          "video/mp4": [".mp4"],
        },
    multiple: true,
  });

  return iconOnly ? (
    <div {...getRootProps()} className="flex items-center justify-center">
      <input {...getInputProps()} />
      <Button
        type="button"
        severity="secondary"
        icon="pi pi-paperclip"
        className="h-10 w-10"
        text
      />
    </div>
  ) : (
    <div className="px-4 bg-white border border-gray-300 rounded-lg shadow-md w-full">
      <div
        {...getRootProps()}
        className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-center">{t("Select FIles")}</p>
      </div>

      {error && <div className="mt-2 p-error text-sm">{error}</div>}
      {files && files?.length > 0 && (
        <div className="flex justify-end my-3">
          <Button onClick={handleClearAll} size="small" severity="danger">
            Clear All
          </Button>
        </div>
      )}

      <div className="my-4 space-y-2">
        {files &&
          files.map((file, index) => (
            <div
              key={file.name + index}
              className="flex items-center space-x-3 p-2 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-10 w-10 object-cover rounded"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faFilePdf}
                  className="h-5 w-5 text-red-600"
                />
              )}

              <span className="flex-1 text-gray-800">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(file.name)}
                className="text-red-600 hover:text-red-800"
                aria-label={`Remove ${file.name}`}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FileSelector;
