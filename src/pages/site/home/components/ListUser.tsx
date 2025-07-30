import { useEffect, useState } from "react";

// Mock WebApp interface for development
const WebApp = {
  ready: () => {},
  initDataUnsafe: {
    user: {
      id: 12345,
      first_name: "John",
      last_name: "Doe",
      username: "johndoe",
      language_code: "en",
      photo_url: "https://via.placeholder.com/100",
      phone: "+1234567890",
    },
  },
};
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    WebApp.ready();
    const tgUser = WebApp.initDataUnsafe?.user;

    if (!tgUser) {
      setError("No user data available");
      setLoading(false);
      return;
    }

    // Optional: Fetch additional user data from API
    fetch(`https://api.restful-api.dev/objects`)
      .then((res) => res.json())
      .then(() => {
        // For now, just use the Telegram user data
        setUser({ ...tgUser });
        setLoading(false);
      })
      .catch((error) => {
        console.error("API fetch error:", error);
        setUser(tgUser); // fallback: use Telegram user data
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No user data available</div>
      </div>
    );

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Hello, {user.first_name}!
        </h2>

        {user.photo_url && (
          <img
            src={user.photo_url}
            alt="User avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200"
          />
        )}

        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">ID:</span>
            <span className="text-gray-800">{user.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Name:</span>
            <span className="text-gray-800">
              {user.first_name} {user.last_name || ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Username:</span>
            <span className="text-gray-800">@{user.username || "N/A"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Language:</span>
            <span className="text-gray-800">{user.language_code || "N/A"}</span>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600">Phone:</span>
              <span className="text-gray-800">{user.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListUser;
