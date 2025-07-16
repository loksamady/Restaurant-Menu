import DevSphereLogo from "@src/assets/Logo/Logo.png";

const AdminFooter = () => {
  return (
    <div className="flex gap-2 items-center justify-center text-xs font-semibold text-slate-500 py-4 ">
      <img alt="logo" className="h-6" src={DevSphereLogo}></img>
      <span className="whitespace-nowrap">
        Copyright © 2025 Devshpere. All rights reserved.
      </span>
    </div>
  );
};

export default AdminFooter;
