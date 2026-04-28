const API_URL = "https://ecommerce.routemisr.com/api/v1";

export const getWishlist = async (token: string) => {
  const res = await fetch(`${API_URL}/wishlist`, {
    method: 'GET',
    headers: {
      token: token,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  return res.json();
};

export const addToWishlist = async (productId: string, token: string) => {
  const res = await fetch(`${API_URL}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({ productId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error adding to wishlist');
  return data;
};

export const removeFromWishlist = async (productId: string, token: string) => {
  const res = await fetch(`${API_URL}/wishlist/${productId}`, {
    method: 'DELETE',
    headers: {
      token: token,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error removing from wishlist');
  return data;
};