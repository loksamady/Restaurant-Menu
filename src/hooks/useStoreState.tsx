import { useCategoryStore } from "@src/state/category";
import { useMerchantStore } from "@src/state/merchant";
import { useRoleStore } from "@src/state/role";

const useStoreState = () => {
  const { clearOptions: clearMerchantOptions } = useMerchantStore();
  const { clearOptions: clearCategoryOptions } = useCategoryStore();
  const { clearOptions: clearRoleOptions } = useRoleStore();

  function clearAllOptionsInStore() {
    clearCategoryOptions();
    clearMerchantOptions();
    clearRoleOptions();
  }

  return { clearAllOptionsInStore };
};

export default useStoreState;
