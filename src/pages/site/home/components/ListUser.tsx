import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  phone?: string;
}
const ListUser = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    WebApp.ready();
    const tgUser = WebApp.initDataUnsafe?.user;
    if (tgUser) {
      setUser({ ...tgUser });
    }
  }, []);
  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Hello, {user.first_name}!</h2>
      <p>
        Phone: {user.phone}
        <br />
        ID: {user.id} <br />
        Username: @{user.username || "N/A"} <br />
        Language: {user.language_code}
      </p>

      {user.photo_url && (
        <img
          src={user.photo_url}
          alt="User avatar"
          style={{ width: 100, borderRadius: "50%" }}
        />
      )}
    </div>
  );
};

export default ListUser;
