import React from "react";
import hero from "@src/assets/Logo/web-app.png";
type Props = {
  title: string;
};

const SiteDetailMainPageTitle: React.FC<Props> = ({ title }) => {
  return (
    <div
      className="items-center justify-center flex h-[15vh] bg-cover bg-blend-overlay bg-black/50 mb-3"
      style={{
        backgroundImage: `url(${hero})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <p className="font-bold text-white text-sm md:text-xl text-center">
        {title}
      </p>
    </div>
  );
};

export default SiteDetailMainPageTitle;
