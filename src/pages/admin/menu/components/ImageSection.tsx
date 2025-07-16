import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Label from "@src/components/Form/Label";
import { IMAGE_URL } from "@src/constant/env";
import { MenuFileType } from "@src/types/menu";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Image } from "primereact/image";
import React from "react";

interface ImageSectionProps {
  mainId?: number;
  files: MenuFileType[];
  onDelete: (file: MenuFileType) => void;
  onMainChange: (number: number) => void;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  mainId,
  files,
  onDelete,
  onMainChange,
}) => {
  const handleDeleteClick = (file: MenuFileType) => {
    onDelete(file);
  };

  return (
    <div className="w-full">
      <Label title={` Images ${files.length}`} />

      <div className="space-y-3">
        {files.map((file: MenuFileType, index: number) => (
          <div
            key={`${file.menuFileId}-${index}`}
            className="flex items-center bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
          >
            {/* Image Thumbnail */}
            <div className="flex-shrink-0  mr-4">
              {file.fileName ? (
                <Image
                  src={`${IMAGE_URL}/${file.fileName}`}
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
              {file.menuFileId && (
                <p className="text-xs text-gray-500 mt-1">
                  ID: {file.menuFileId}
                </p>
              )}
            </div>

            {/* Delete Button */}
            <div className="flex items-center space-x-2">
              <Checkbox
                onChange={() => onMainChange(file.menuFileId!)}
                checked={mainId === file.menuFileId}
              ></Checkbox>
              <Button
                type="button"
                icon={<FontAwesomeIcon icon={faTrash} />}
                severity="danger"
                className="w-6 h-6 text-xs p-4"
                size="small"
                text
                onClick={() => handleDeleteClick(file)}
              ></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
