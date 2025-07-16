import Label from "@src/components/Form/Label";
import { PageType, PageTypesResponse } from "@src/types/page";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { TreeNode } from "primereact/treenode";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import JoditEditor from "jodit-react";
import useJoditEditor from "@src/hooks/useJoditEditor";
import { adminGetPages } from "@src/api/service/adminPageService";
import { CreatePageSchemaType } from "@src/validationType/page";
import FormInput from "@src/components/Form/FormInput";

type Props = {
  form: UseFormReturn<CreatePageSchemaType>;
  isLoading: boolean;
  handleSubmit: (data: CreatePageSchemaType) => void;
  id?: number;
};

const PageForm = ({ form, isLoading, handleSubmit, id }: Props) => {
  const { editorRef, editorConfig } = useJoditEditor();

  const [pageNodes, setPageNodes] = useState<TreeNode[] | undefined>();

  const { data: pages, isLoading: pagesLoading } = useQuery<PageTypesResponse>({
    queryKey: ["adminPages"],
    queryFn: adminGetPages,
  });

  const getMaxDepth = (pages: PageType[]): number => {
    let maxDepth = 0;

    const traverse = (page: PageType, currentDepth: number) => {
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }

      if (page.childPages && page.childPages.length > 0) {
        page.childPages.forEach((childPage) =>
          traverse(childPage, currentDepth + 1)
        );
      }
    };

    pages.forEach((page) => traverse(page, 1));
    return maxDepth;
  };

  const findPage = (
    pages: PageType[],
    level: number
  ): { page: PageType; level: number } | undefined => {
    for (const page of pages) {
      if (page.id === id) {
        return { page, level };
      } else if (page.childPages && page.childPages.length > 0) {
        const foundPage = findPage(page.childPages, level + 1);
        if (foundPage) {
          return foundPage;
        }
      }
    }
    return undefined;
  };

  const getPageNodes = (
    pages: PageType[],
    level: number,
    breakPoint: number
  ): TreeNode[] | undefined => {
    if (level === breakPoint) return [];
    return pages
      .filter((page) => page.id !== id)
      .map((page) => {
        const menu = {
          label: page.titleEn || "",
          key: page.id.toString(),
          data: { ...page },
          children: getPageNodes(page.childPages, level + 1, breakPoint),
        };
        return menu;
      });
  };

  const getBreakPoint = () => {
    const pageLevel = findPage(pages?.data || [], 1);
    let breakPoint = 3;
    switch (pageLevel?.level) {
      case 3:
        breakPoint = 3;
        break;
      case 2:
        if (pageLevel.page.childPages.length > 0) {
          breakPoint = 2;
        } else {
          breakPoint = 3;
        }
        break;
      case 1:
        if (pageLevel.page.childPages.length > 0) {
          const level = getMaxDepth(pageLevel.page.childPages);
          if (level === 1) {
            breakPoint = 2;
          }
          if (level === 2) {
            breakPoint = 1;
          }
        } else {
          breakPoint = 3;
        }
        break;
      default:
        breakPoint = 3;
        break;
    }
    return breakPoint;
  };

  useEffect(() => {
    if (pages?.data) {
      const breakPoint = getBreakPoint();
      const pageNodes = getPageNodes(pages?.data, 1, breakPoint);
      setPageNodes(pageNodes);
    }
  }, [pages?.data]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid grid-cols-2 gap-3 items-center">
        <Controller
          name="parentId"
          control={form.control}
          render={({ field }) => (
            <div className="flex-1">
              <Label title="Parent" />
              <TreeSelect
                showClear
                disabled={pagesLoading}
                options={pageNodes}
                value={form.watch("parentId")?.toString()}
                onChange={(e: TreeSelectChangeEvent) => {
                  const value = e.value;
                  if (typeof value === "string") {
                    field.onChange(parseInt(value));
                  } else {
                    field.onChange(e.value);
                  }
                }}
                filter
                className="flex-1 w-full text-sm"
                placeholder="Select Parent"
              ></TreeSelect>
            </div>
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field }) => (
            <div className="flex-1">
              <Label title="Status" />
              <InputSwitch
                checked={field.value == 1}
                onChange={(e) => {
                  field.onChange(e.value ? 1 : 0);
                }}
              />
            </div>
          )}
        />
        <FormInput
          name="titleEn"
          placeholder="Title En"
          title="Title En"
          control={form.control}
          required
        />
        <FormInput
          name="titleKh"
          placeholder="Title Kh"
          title="Title Kh"
          control={form.control}
          required
        />
        <Controller
          name="url"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex-1">
              <Label title="Url" />
              <InputText
                value={field.value}
                placeholder="https://example.com"
                className={
                  classNames({
                    "p-invalid": fieldState.error,
                  }) + " p-inputtext-sm w-full md:w-20rem"
                }
                onChange={field.onChange}
              />
            </div>
          )}
        />
        <Controller
          name="displayOrder"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex-1">
              <Label title="Display Order" />
              <InputNumber
                min={0}
                placeholder="1"
                value={field.value}
                className={
                  classNames({
                    "p-invalid": fieldState.error,
                  }) + " p-inputtext-sm w-full md:w-20rem"
                }
                onChange={(e) => field.onChange(e.value)}
                useGrouping={false}
              />
            </div>
          )}
        />
      </div>

      <div className="flex flex-col">
        <TabView>
          {/* <TabPanel header="Khmer" headerClassName="text-sm">
            <Controller
              name="descriptionKh"
              control={form.control}
              render={({ field }) => (
                <JoditEditor
                  config={editorConfig}
                  ref={editorRef}
                  value={field.value || ""}
                  onBlur={(newContent) => field.onChange(newContent)} // preferred to use only this option to update the content for performance reasons
                />
              )}
            />
          </TabPanel> */}
          <TabPanel header="English" headerClassName="text-sm">
            <Controller
              name="descriptionEn"
              control={form.control}
              render={({ field }) => (
                <JoditEditor
                  config={editorConfig}
                  ref={editorRef}
                  value={field.value || ""}
                  onBlur={(newContent) => field.onChange(newContent)} // preferred to use only this option to update the content for performance reasons
                />
              )}
            />
          </TabPanel>
        </TabView>
      </div>

      <div className="flex justify-end">
        <Button
          disabled={isLoading}
          loading={isLoading}
          label={id ? "Update" : "Create"}
          size="small"
          type="submit"
          className="h-10"
          onClick={() => form.handleSubmit(handleSubmit)}
        />
      </div>
    </form>
  );
};

export default PageForm;
