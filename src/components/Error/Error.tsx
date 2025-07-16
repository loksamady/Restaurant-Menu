import DevSphereLogo from "@src/assets/logos/dev_sphere.png";
import { Divider } from "primereact/divider";

type Props = {
  statusCode: number;
  title: string;
  subtitle: string;
};

export default function Error({ statusCode, title, subtitle }: Props) {
  return (
    <div className="flex items-center justify-center h-screen text-center px-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <img src={DevSphereLogo} className="h-44 my-10" />
        <Divider layout="vertical" className="hidden md:block" />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-7xl font-bold text-red-500">{statusCode}</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">{title}</h2>
          <p className="text-gray-500 mt-2">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
