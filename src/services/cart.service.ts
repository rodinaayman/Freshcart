const API_URL = "https://ecommerce.routemisr.com/api/v1";

export const getCart = async (token: string) => {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'GET',
    headers: {
      token: token, 
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) return { numOfCartItems: 0, data: { products: [] } };
    throw new Error('Failed to fetch cart');
  }
  return res.json();
};

export const addToCart = async (productId: string, token: string) => {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({ productId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error adding to cart');
  return data;
};

export const removeFromCart = async (productId: string, token: string) => {
  const res = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      token: token,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error removing from cart');
  return data;
};

export const updateCartQuantity = async (productId: string, quantity: number, token: string) => {
  const res = await fetch(`${API_URL}/cart/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
    body: JSON.stringify({ count: quantity }), 
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error updating cart');
  return data;
};


export const clearCart = async (token: string) => {
    const res = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: { token: token }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
};


