import { ProgressSpinner } from "primereact/progressspinner";

function Loading() {
  return (
    <div className="fixed h-screen top-0 left-0 w-full flex justify-center items-center z-50">
      <ProgressSpinner
        style={{ width: "50px", height: "50px" }}
        strokeWidth="8"
        animationDuration="1s"
      />
    </div>
  );
}

export default Loading;
