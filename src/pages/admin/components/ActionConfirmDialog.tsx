import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

type Props = {
  id: number;
  dialogTitle: string;
  dialogIcon: IconProp;
  dialogContent: string;
  dialogHeaderClassName?: string;
  yesButtonSeverity?:
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "help"
    | undefined;
  query?: { lang: string };
  queryKey?: string;
  mutationFn: (id: number, query?: { lang: string }) => Promise<boolean>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  successCallback?: (id: number) => void;
  onSuccess?: () => void;
};

const ActionConfirmDialog = ({
  id,
  dialogTitle,
  dialogIcon,
  dialogContent,
  dialogHeaderClassName = "text-red-500",
  yesButtonSeverity = "danger",
  query,
  queryKey,
  mutationFn,
  visible,
  setVisible,
  successCallback,
  onSuccess,
}: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, query }: { id: number; query?: { lang: string } }) =>
      mutationFn(id, query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setVisible(false);
      successCallback && successCallback(id);
      onSuccess && onSuccess();
    },
  });

  const headerContent = (
    <p>
      <FontAwesomeIcon icon={dialogIcon} className="mr-2" />
      <span>{dialogTitle}</span>
    </p>
  );

  const footerContent = (
    <div className="pt-4 space-x-2">
      <Button
        label="No"
        icon="pi pi-times text-xs"
        iconPos="right"
        severity="secondary"
        className="py-2 px-3"
        disabled={isPending}
        loading={isPending}
        size="small"
        text
        onClick={() => setVisible(false)}
      />
      <Button
        label="Yes"
        icon="pi pi-check text-xs"
        iconPos="right"
        severity={yesButtonSeverity}
        className="py-2 px-3"
        disabled={isPending}
        loading={isPending}
        size="small"
        autoFocus
        onClick={() => (query ? mutate({ id, query }) : mutate({ id }))}
      />
    </div>
  );

  return (
    <div className="flex justify-content-center">
      <Dialog
        header={headerContent}
        headerClassName={dialogHeaderClassName}
        visible={visible}
        style={{ width: "25vw" }}
        breakpoints={{ "1280px": "50vw", "1024px": "75vw", "640px": "100vw" }}
        contentClassName="px-6 py-2"
        footer={footerContent}
        onHide={() => setVisible(false)}
      >
        {dialogContent}
      </Dialog>
    </div>
  );
};

export default ActionConfirmDialog;
