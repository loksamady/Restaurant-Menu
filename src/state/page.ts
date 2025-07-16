import { PageType } from '@src/types/page';
import { create } from 'zustand';

type PageState = {
    pages: PageType[];
    setPages: (pages: PageType[]) => void;
}

const usePageStore = create<PageState>((set) => ({
    pages: [],
    setPages: (pages) => set({ pages }),
}));

export default usePageStore;
