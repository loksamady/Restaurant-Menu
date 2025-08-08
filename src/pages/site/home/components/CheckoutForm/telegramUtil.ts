export function getTelegramUser(WebApp: any) {
  const user = WebApp?.initDataUnsafe?.user;
  if (!user) return null;
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    photo_url: user.photo_url,
    language_code: user.language_code,
  };
}

export function getMockTelegramUser() {
  return {
    id: 123456789,
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    photo_url: undefined,
    language_code: "en",
  };
}


