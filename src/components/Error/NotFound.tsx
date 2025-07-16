import Error from "./Error";

export default function NotFound() {
  return (
    <Error
      statusCode={404}
      title="Page Not Found"
      subtitle="Sorry, the page you are looking for does not exist."
    />
  );
}
