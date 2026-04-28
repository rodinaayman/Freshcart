const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export const getAddresses = async (token: string) => {
  const res = await fetch(`${BASE_URL}/addresses`, {
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export const addAddress = async (token: string, data: any) => {
  const payload = {
    address: {
      name: data.name,
      details: data.details, 
      phone: data.phone,
      city: data.city
    }
  };

  const res = await fetch(`${BASE_URL}/addresses`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add");
  }
  return res.json();
};

export const updateAddress = async (token: string, id: string, data: any) => {
  const payload = {
    address: {
      name: data.name,
      details: data.details,
      phone: data.phone,
      city: data.city
    }
  };

  const res = await fetch(`${BASE_URL}/addresses/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "token": token
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update");
  return res.json();
};

export const deleteAddress = async (token: string, id: string) => {
  const res = await fetch(`${BASE_URL}/addresses/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "token": token
    }
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
};



export const signIn = async (credentials: { email: string; password: string }) => {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const signUp = async (userData: object) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
};

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${BASE_URL}/auth/forgotPasswords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send reset code");
  return data;
};

export const verifyResetCode = async (resetCode: string) => {
  const res = await fetch(`${BASE_URL}/auth/verifyResetCode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetCode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Invalid code");
  return data;
};

export const resetPassword = async (payload: { email: string; newPassword: string }) => {
  const res = await fetch(`${BASE_URL}/auth/resetPassword`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
  return data;
};