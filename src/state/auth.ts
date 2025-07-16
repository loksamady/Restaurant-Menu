import { MerchantAuthType } from "@src/types/admin/merchant";
import { UserType } from "@src/types/user";
import { StateCreator, create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";

type AuthStore = {
  auth: {
    token: string | null;
    roles: string[];
    authUser: UserType | null;
  };
  setAuth: (token: string, roles: string[], authUser: UserType) => void;
  logout: () => void;
  updateMerchants: (merchants: MerchantAuthType[]) => void;
};

type LanguagePersist = (
  config: StateCreator<AuthStore>,
  options: PersistOptions<AuthStore>
) => StateCreator<AuthStore>;

export const useAuthStore = create<AuthStore, []>(
  (persist as LanguagePersist)(
    (set) => ({
      auth: {
        token: null,
        roles: [],
        authUser: null,
      },
      setAuth: (token: string, roles: string[], authUser: UserType) =>
        set(() => ({
          auth: { token: token, roles: roles, authUser: authUser },
        })),
      logout: () =>
        set(() => ({ auth: { token: null, roles: [], authUser: null } })),
      updateMerchants: (merchants: MerchantAuthType[]) =>
        set((state) => ({
          auth: {
            ...state.auth,
            authUser: state.auth.authUser
              ? { ...state.auth.authUser, merchants }
              : null,
          },
        })),
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
