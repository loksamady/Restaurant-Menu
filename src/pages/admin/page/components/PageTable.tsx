import { PageType, PageTypesResponse } from "@src/types/page";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";
import { TreeTable } from "primereact/treetable";
import { useEffect, useState } from "react";
import "./style.css";
import CreatePageDialog from "./CreatePageDialog";
import UpdatePageDialog from "./UpdatePageDialog";
// import { PAGE_STATUS, PAGE_STATUS_LABEL } from "@src/enum/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { Tag } from "primereact/tag";
import {
  adminDeletePage,
  adminGetPages,
} from "@src/api/service/adminPageService";
import ActionConfirmDialog from "../../components/ActionConfirmDialog";
import LoadingCard from "@src/components/LoadingCard";
import ErrorCard from "@src/components/ErrorCard";

const PageTable = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [tableNodes, setTableNodes] = useState<TreeNode[] | undefined>();

  const { data, isLoading, isError } = useQuery<PageTypesResponse>({
    queryKey: ["adminPages"],
    queryFn: adminGetPages,
  });

  const actionTemplate = (node: TreeNode) => {
    return (
      <div className="flex flex-row justify-center gap-2">
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faPen} />}
          severity="info"
          className="w-6 h-6 text-xs p-4"
          size="small"
          text
          onClick={() => {
            setUpdateVisible(true);
            setSelectedId(node.data.id);
          }}
        />
        <Button
          type="button"
          icon={<FontAwesomeIcon icon={faTrash} />}
          severity="danger"
          className="w-6 h-6 text-xs p-4"
          size="small"
          text
          onClick={() => {
            setDeleteVisible(true);
            setSelectedId(node.data.id);
          }}
        />
      </div>
    );
  };

  // const statusTemplate = (node: TreeNode) => {
  //   return (
  //     <Tag
  //       value={PAGE_STATUS_LABEL[node.data.status]}
  //       severity={
  //         node.data.status === PAGE_STATUS.ACTIVE ? "success" : "danger"
  //       }
  //     />
  //   );
  // };

  const getTableData = (
    pages: PageType[],
    level: number
  ): TreeNode[] | undefined => {
    return pages.map((page) => {
      const menu = {
        label: page.titleEn || "",
        key: page.id.toString(),
        data: { ...page, level },
        children: getTableData(page.childPages, level + 1),
      };
      return menu;
    });
  };

  useEffect(() => {
    if (data?.data) {
      const tableData = getTableData(data?.data, 1);
      setTableNodes(tableData);
    }
  }, [data?.data]);

  if (isLoading) return <LoadingCard />;

  if (isError) return <ErrorCard />;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm w-auto">
      <CreatePageDialog visible={visible} setVisible={setVisible} />
      {updateVisible && (
        <UpdatePageDialog
          visible={updateVisible}
          setVisible={setUpdateVisible}
          id={selectedId!}
        />
      )}
      <ActionConfirmDialog
        id={selectedId!}
        dialogTitle="Confirm Delete Page"
        dialogIcon={faTrash}
        dialogContent="Are you sure you want to delete this page?"
        queryKey="adminPages"
        mutationFn={adminDeletePage}
        visible={deleteVisible}
        setVisible={setDeleteVisible}
      />

      <TreeTable
        stripedRows
        value={tableNodes}
        className="text-sm"
        tableStyle={{ minWidth: "10rem" }}
        loading={isLoading}
      >
        <Column field="titleEn" header="Title" expander></Column>
        <Column field="path" header="Path"></Column>
        <Column
          field="displayOrder"
          header="Order"
          alignHeader="center"
          className="text-center"
        ></Column>
        {/* <Column
          field="status"
          header="Status"
          alignHeader="center"
          className="text-center"
          body={statusTemplate}
        ></Column> */}
        <Column body={actionTemplate} header="Action" alignHeader="center" />
      </TreeTable>
    </div>
  );
};

export default PageTable;
