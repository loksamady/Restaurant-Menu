import { getPages } from "@src/api/service/pageService";
import DescriptionContent from "@src/components/DescriptionContent";
import ContactPage from "@src/pages/site/contact/ContactPage";
import usePageStore from "@src/state/page";
import { PageType, PageTypesResponse } from "@src/types/page";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { RouteObject } from "react-router-dom";

type ComponentProps = {
  page: PageType;
};

type ComponentMappingType = {
  component: (props: ComponentProps) => JSX.Element | undefined;
  dynamicComponent?: (props: ComponentProps) => JSX.Element | undefined;
  isParentDynamic?: boolean;
};

type PageElementType = {
  element: React.ReactNode;
  dynamicElement?: React.ReactNode;
  isParentDynamic?: boolean;
};

const componentMapping: {
  [key: string]: ComponentMappingType;
} = {
  ContactPage: {
    component: ContactPage,
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const findDeepestChildPath = (page: PageType): string | null => {
  if (page.childPages && page.childPages.length > 0) {
    return findDeepestChildPath(page.childPages[0]);
  } else {
    return `/:lng${page.path}` ?? null;
  }
};

function getElement(page: PageType): PageElementType {
  if (page.childPages.length > 0) {
    return { element: undefined };
  } else {
    const component = page.pageComponent
      ? componentMapping[page.pageComponent]
      : null;
    const ParentComponent = component?.component;
    if (ParentComponent) {
      const DynamicComponent = component.dynamicComponent;
      if (DynamicComponent) {
        return {
          element: <ParentComponent page={page} />,
          dynamicElement: <DynamicComponent page={page} />,
          isParentDynamic: component.isParentDynamic,
        };
      } else {
        return {
          element: <ParentComponent page={page} />,
          isParentDynamic: component.isParentDynamic,
        };
      }
    } else {
      return {
        element: <DescriptionContent page={page} />,
        isParentDynamic: false,
      };
    }
  }
}

const createRouteElements = (pages: PageType[]): RouteObject[] => {
  const dynamicRoutes: RouteObject[] = [];
  const routes = pages
    .filter((page) => !page.url)
    .map((page) => {
      const pageElement: PageElementType = getElement(page);
      const parentPath = pageElement.isParentDynamic
        ? `/:lng${page.path}/:id`
        : `/:lng${page.path}`;
      const children: RouteObject[] | undefined = page.childPages
        ? createRouteElements(page.childPages)
        : undefined;
      const route: RouteObject = {
        path:
          page.childPages.length > 0 || (page.url && page.url.length > 0)
            ? undefined
            : parentPath ?? undefined,
        element: pageElement.element,
        children,
      };
      /// IF PAGE HAVE DYNAMIC ROUTE
      if (pageElement.dynamicElement) {
        const dynamicRoute: RouteObject = {
          path:
            page.childPages.length > 0 || (page.url && page.url.length > 0)
              ? undefined
              : `${parentPath}/:id` ?? undefined,
          element: pageElement.dynamicElement,
        };
        dynamicRoutes.push(dynamicRoute);
      }

      return route;
    });
  const totalRoutes = [...dynamicRoutes, ...routes];
  return totalRoutes;
};

const useDynamicRoutes = () => {
  const { setPages } = usePageStore();

  const { data, isLoading, isError, isSuccess } = useQuery<PageTypesResponse>({
    queryKey: ["pages"],
    queryFn: getPages,
  });

  useEffect(() => {
    if (data?.data) {
      setPages(data.data);
    }
  }, [data, setPages]);

  if (isLoading) return { routes: [], isLoading: true };

  if (isError) return { routes: [], isLoading: false };

  if (isSuccess) {
    return {
      routes: [...createRouteElements(data.data)],
      isLoading: false,
    };
  }

  return { routes: [], isLoading: false };
};

export default useDynamicRoutes;
