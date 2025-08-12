import { Dialog } from "primereact/dialog";
import React from "react";

interface DialogWrapperProps {
  visible: boolean;
  onHide: () => void;
  className?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({
  visible,
  onHide,
  className,
  header,
  children,
  footer,
  style,
  headerStyle,
  contentStyle,
}) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      className={className}
      header={header}
      footer={footer}
      style={style}
      headerStyle={headerStyle}
      contentStyle={contentStyle}
    >
      {children}
    </Dialog>
  );
};

export default DialogWrapper;
