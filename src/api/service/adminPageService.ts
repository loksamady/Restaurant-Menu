import { PAGES_ENDPOINT } from "@src/constant/admin/constant";
import { CreatePageSchemaType } from "@src/validationType/page";
import { toast } from "sonner";
import { secureGet, securePost, securePut, secureRemove } from "../config";

export const adminGetPages = async () => {
    const data = await secureGet(`${PAGES_ENDPOINT}`);
    return data;
};

export const adminGetPage = async (id: number) => {
    const data = await secureGet(`${PAGES_ENDPOINT}/${id}`);
    return data;
};

export const adminCreatePage = async (createPage: CreatePageSchemaType) => {
    const data = securePost<CreatePageSchemaType>(`${PAGES_ENDPOINT}`, createPage);

    if (data)
        toast.promise(data, {
            loading: 'Loading...',
            success: () => {
                return `Page has been created`;
            },
            error: 'Error',
        });
    return await data;
};

export const adminUpdatePage = async (
    updatePage: CreatePageSchemaType,
    id: number
) => {
    const data = securePut<CreatePageSchemaType>(`${PAGES_ENDPOINT}/${id}`, updatePage);

    if (data)
        toast.promise(data, {
            loading: 'Loading...',
            success: () => {
                return `Page has been updated`;
            },
            error: 'Error',
        });

    return await data;
};

export const adminDeletePage = async (id: number) => {
    const data = secureRemove(`${PAGES_ENDPOINT}/${id}`);

    if (data)
        toast.promise(data, {
            loading: 'Loading...',
            success: () => {
                return `Page has been deleted`;
            },
            error: 'Error',
        });

    return await data;
};
