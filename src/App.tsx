import { Toaster } from "sonner";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useRoute } from "./hooks/useRoute";
import Loading from "./components/Loading";

function App() {
  const { routes, isLoading } = useRoute();
  const browserRouter = createBrowserRouter(routes);

  if (isLoading) return <Loading />;

  return (
    <div>
      <RouterProvider router={browserRouter}></RouterProvider>
      <Toaster position="top-right" expand={true} richColors closeButton />
    </div>
  );
}

export default App;
