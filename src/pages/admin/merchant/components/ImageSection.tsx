import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Label from "@src/components/Form/Label";
import { IMAGE_URL } from "@src/constant/env";
import { FileType } from "@src/types/file";
import { Button } from "primereact/button";
// import { Checkbox } from "primereact/checkbox";
import { Image } from "primereact/image";
import React, { ReactNode } from "react";

interface ImageSectionProps {
  label?: string;
  remark?: string;
  mainId?: number;
  files: FileType[];
  customButton?: ReactNode;
  onDelete?: (file: FileType) => void;
  onMainChange?: (number: number) => void;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  label,
  remark,
  // mainId,
  files,
  customButton,
  onDelete,
  // onMainChange,
}) => {
  const handleDeleteClick = (file: FileType) => {
    onDelete && onDelete(file);
  };

  return (
    <div className="w-full">
      {label && <Label title={`${label}: ${files.length}`} remark={remark} />}

      <div className="space-y-3">
        {files.map((file, index) => (
          <div
            key={`${file.id}-${index}`}
            className="flex items-center bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
          >
            {/* Image Thumbnail */}
            <div className="flex-shrink-0  mr-4">
              {file.fileName ? (
                <Image
                  src={
                    file?.fileUrl ||
                    `${IMAGE_URL}/merchant_logos/${file.fileName}`
                  }
                  alt="Image"
                  imageClassName="w-full h-full object-cover"
                  className="h-16 w-16"
                  preview
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>

            {/* File Information */}
            <div className="flex-grow min-w-0">
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={file.fileName || "Unknown file"}
              >
                {file.fileName || "Unknown file"}
              </p>
              {file.id && (
                <p className="text-xs text-gray-500 mt-1">ID: {file.id}</p>
              )}
            </div>

            {/* Delete Button */}
            {!customButton ? (
              <div className="flex items-center space-x-2">
                {/* <Checkbox
                  onChange={() => onMainChange && onMainChange(file.id!)}
                  checked={mainId === file.id}
                /> */}
                <Button
                  type="button"
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  severity="danger"
                  className="w-6 h-6 text-xs p-4"
                  size="small"
                  text
                  onClick={() => handleDeleteClick(file)}
                />
              </div>
            ) : (
              customButton
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
