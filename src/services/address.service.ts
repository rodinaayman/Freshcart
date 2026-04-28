
export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressPayload {
  name: string;
  details: string;
  phone: string;
  city: string;
}

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  token: token, 
});

export const addressService = {
  getAddresses: async (token: string): Promise<Address[]> => {
    const res = await fetch(`${BASE_URL}/addresses`, {
      method: "GET",
      headers: getHeaders(token),
    });

    const data = await res.json();
    
    if (!res.ok || data.status === "fail") {
      throw new Error(data.message || "Failed to fetch addresses");
    }
    
    return data.data; 
  },

  addAddress: async (token: string, payload: AddressPayload): Promise<Address> => {
    const res = await fetch(`${BASE_URL}/addresses`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.status === "fail") {
      throw new Error(data.message || "Failed to add address");
    }

    return data.data; 
  },

  deleteAddress: async (token: string, id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/addresses/${id}`, {
      method: "DELETE",
      headers: getHeaders(token),
    });

    const data = await res.json();

    if (!res.ok || data.status === "fail") {
      throw new Error(data.message || "Failed to delete address");
    }
  },

  updateAddress: async (token: string, id: string, payload: AddressPayload): Promise<Address> => {
    const res = await fetch(`${BASE_URL}/addresses/${id}`, {
      method: "PUT", 
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.status === "fail") {
      throw new Error(data.message || "Failed to update address");
    }

    return data.data;
  },
};