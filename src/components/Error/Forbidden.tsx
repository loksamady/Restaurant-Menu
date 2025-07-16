import Error from "./Error";

export default function Forbidden() {
  return (
    <Error
      statusCode={403}
      title="Access Denied"
      subtitle="You do not have permission to view this page."
    />
  );
}
