import PageHeader from "@src/components/admin/PageHeader";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { faAdd, faShop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateDialog from "./components/CreateDialog";
import MerchantTable from "./components/MerchantTable";
import { useAuthStore } from "@src/state/auth";
import { useQuery } from "@tanstack/react-query";
import {
  MerchantAuthResponseType,
  MerchantListResponseType,
} from "@src/types/admin/merchant";
import {
  getAuthMerchants,
  getMerchants,
} from "@src/api/service/merchant.service";
import ErrorCard from "@src/components/ErrorCard";
import useAuth from "@src/hooks/useAuth";

const MerchantPage = () => {
  const { auth, updateMerchants } = useAuthStore();
  const { isOwner } = useAuth();
  const [visible, setVisible] = useState<boolean>(false);

  const { data, isLoading, isError, error } =
    useQuery<MerchantListResponseType>({
      queryKey: ["merchants"],
      queryFn: getMerchants,
    });

  const { data: merchantAuth } = useQuery<MerchantAuthResponseType>({
    queryKey: ["merchant-auth"],
    queryFn: isOwner() ? getAuthMerchants : undefined,
  });

  const totalMerchant = data?.totalRecords ?? 0;
  const limitMerchant = auth?.authUser?.vendor?.merchantLimit ?? 0;
  const isMerchantLimitMax = totalMerchant >= limitMerchant;

  const headerActionButtons = () => {
    return (
      <Button
        label="New Merchant"
        icon={<FontAwesomeIcon icon={faAdd} className="mr-2" />}
        iconPos="right"
        className="h-10"
        size="small"
        onClick={() => setVisible(true)}
      />
    );
  };

  useEffect(() => {
    if (merchantAuth?.data) updateMerchants(merchantAuth?.data);
  }, [merchantAuth?.data]);

  if (isError) return <ErrorCard message={error?.message} />;

  return (
    <div>
      <PageHeader
        title="Merchants"
        tagValue={`Maximum ${limitMerchant}`}
        tagSeverity="info"
        icon={faShop}
        actionContent={!isMerchantLimitMax ? headerActionButtons() : undefined}
      />
      <div>
        {data && <MerchantTable merchantData={data} isLoading={isLoading} />}
        <CreateDialog visible={visible} setVisible={setVisible} />
      </div>
    </div>
  );
};

export default MerchantPage;
