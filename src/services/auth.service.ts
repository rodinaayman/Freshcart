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