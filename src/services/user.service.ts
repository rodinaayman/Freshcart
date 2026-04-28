
const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export const updateUserData = async (token: string, data: { name?: string; email?: string; phone?: string }) => {
  const res = await fetch(`${BASE_URL}/users/updateMe/`, { 
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const changeUserPassword = async (token: string, data: { currentPassword: string; password: string; rePassword: string }) => {
  const res = await fetch(`${BASE_URL}/users/changeMyPassword`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};