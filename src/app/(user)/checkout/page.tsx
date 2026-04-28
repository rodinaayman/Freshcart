"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getCart } from "@/services/cart.service";
import { addressService, Address, AddressPayload } from "@/services/address.service";
import { createCashOrder, createCheckoutSession } from "@/services/orders.service";
import { formatePrice } from "@/lib/formatter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { 
  FaReceipt, FaArrowLeft, FaHome, FaBookmark, FaMapMarkerAlt, 
  FaPhone, FaCity, FaPlus, FaWallet, FaMoneyBill, 
  FaCheck, FaCreditCard, FaShieldAlt, FaTruck, FaBox, FaShoppingBag
} from "react-icons/fa";
import { Loader2 } from "lucide-react";

interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: { _id: string; title: string; imageCover: string; };
}

interface CartData {
  _id: string;
  products: CartItem[];
  totalCartPrice: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  
  const [formData, setFormData] = useState<AddressPayload>({
    name: "", city: "", details: "", phone: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    const fetchCart = async () => {
      if (session?.accessToken) {
        try {
          const res = await getCart(session.accessToken);
          if (res?.data) { 
            setCart(res.data); 
            if (res.data.products.length === 0) router.push("/cart");
          }
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
      }
    };
    if (status === "authenticated") fetchCart();
  }, [status, session, router]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (session?.accessToken) {
        try {
          const data = await addressService.getAddresses(session.accessToken);
          setAddresses(data);
          if (data.length > 0) {
            setSelectedAddress(data[0]._id);
          } else {
            setSelectedAddress("new");
          }
        } catch (error) { console.error(error); } 
        finally { setLoadingAddresses(false); }
      }
    };
    if (status === "authenticated") fetchAddresses();
  }, [status, session]);

  useEffect(() => {
    if (selectedAddress && selectedAddress !== "new") {
      const addr = addresses.find(a => a._id === selectedAddress);
      if (addr) {
        setFormData({
          name: addr.name,
          city: addr.city,
          details: addr.details,
          phone: addr.phone
        });
      }
    } else {
      setFormData({ name: "", city: "", details: "", phone: "" });
    }
  }, [selectedAddress, addresses]);

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.city || !formData.details || !formData.phone) {
      toast.error("Please fill in all address fields.");
      return;
    }

    if (!cart?._id) {
      toast.error("Cart ID is missing. Please refresh the page.");
      return;
    }

    setSubmitting(true);
    try {
      const shippingAddress = {
        name: formData.name,
        city: formData.city,
        details: formData.details,
        phone: formData.phone
      };

      if (paymentMethod === "cash") {
        await createCashOrder(cart._id, session!.accessToken, shippingAddress);
        toast.success("Order Placed Successfully!");
        router.push("/orders/allorders");
      } else {
        const res = await createCheckoutSession(cart._id, session!.accessToken, shippingAddress);
        if (res.session && res.session.url) {
          window.location.href = res.session.url;
        } else {
          toast.error("Failed to get payment link");
        }
      }

    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !cart) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-green-600" /></div>;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8">
      <div className="container mx-auto px-4">
        
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600 transition">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-primary-600 transition">Cart</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="bg-[#25c95e] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <FaReceipt />
              </span>
              Complete Your Order
            </h1>
            <p className="text-gray-500 mt-2">Review your items and complete your purchase</p>
          </div>
          <Link href="/cart" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all">
            <FaArrowLeft /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-[#25c95e] px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaHome /> Shipping Address</h2>
                <p className="text-green-100 text-sm mt-1">Where should we deliver your order?</p>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FaBookmark className="text-primary-500 text-sm" />
                    <span className="font-semibold text-gray-800">Saved Addresses</span>
                  </div>
                  
                  {loadingAddresses ? <div className="flex justify-center py-4"><Loader2 className="animate-spin"/></div> : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => setSelectedAddress(addr._id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 
                          ${selectedAddress === addr._id 
                            ? 'border-[#25c95e] bg-green-50' 
                            : 'border-gray-200 hover:border-[#25c95e] hover:bg-gray-50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
                            ${selectedAddress === addr._id ? 'bg-[#25c95e] text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {selectedAddress === addr._id ? <FaCheck /> : <FaMapMarkerAlt />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900">{addr.name}</p>
                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{addr.details}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><FaPhone className="text-[10px]" /> {addr.phone}</span>
                              <span className="flex items-center gap-1"><FaCity className="text-[10px]" /> {addr.city}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSelectedAddress("new")}
                      className={`w-full p-4 rounded-xl border-2 border-dashed text-left transition-all duration-200 
                        ${selectedAddress === "new" 
                          ? 'border-[#25c95e] bg-green-50' 
                          : 'border-gray-300 hover:border-[#25c95e] hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                          ${selectedAddress === "new" ? 'bg-[#25c95e] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <FaPlus />
                        </div>
                        <div>
                          <p className={`font-semibold ${selectedAddress === "new" ? 'text-[#25c95e]' : 'text-gray-700'}`}>Add New Address</p>
                          <p className="text-xs text-gray-500">Enter details manually</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  )}
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">Address Name</Label>
                    <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                         <FaBookmark className="text-gray-500 text-sm" />
                       </div>
                       <Input
                         placeholder="e.g. Home"
                         className="pl-14 py-6 text-base border-2 rounded-xl"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">City</Label>
                    <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                         <FaCity className="text-gray-500 text-sm" />
                       </div>
                       <Input
                         placeholder="Cairo, Giza..."
                         className="pl-14 py-6 text-base border-2 rounded-xl"
                         value={formData.city}
                         onChange={(e) => setFormData({...formData, city: e.target.value})}
                       />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</Label>
                    <div className="relative">
                       <div className="absolute left-4 top-4 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                         <FaMapMarkerAlt className="text-gray-500 text-sm" />
                       </div>
                       <textarea
                         rows={3}
                         className="w-full px-4 py-3.5 pl-14 border-2 rounded-xl focus:outline-none transition-all resize-none border-gray-200 focus:border-[#25c95e] bg-white"
                         placeholder="Street name, building..."
                         value={formData.details}
                         onChange={(e) => setFormData({...formData, details: e.target.value})}
                       ></textarea>
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</Label>
                    <div className="relative">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                         <FaPhone className="text-gray-500 text-sm" />
                       </div>
                       <Input
                         type="tel"
                         placeholder="01xxxxxxxxx"
                         className="pl-14 py-6 text-base border-2 rounded-xl"
                         value={formData.phone}
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-[#25c95e] px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaWallet /> Payment Method</h2>
              </div>
              <div className="p-6 space-y-4">
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`w-full p-5 rounded-xl border-2 transition-all flex items-center gap-4 group 
                    ${paymentMethod === "cash" 
                      ? 'border-[#25c95e] bg-green-50 shadow-sm' 
                      : 'border-gray-200 hover:border-[#25c95e]'}`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-all 
                    ${paymentMethod === "cash" ? 'bg-[#25c95e] text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>
                    <FaMoneyBill />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-bold text-lg ${paymentMethod === "cash" ? 'text-[#25c95e]' : 'text-gray-900'}`}>Cash on Delivery</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Pay when your order arrives</p>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all 
                    ${paymentMethod === "cash" ? 'bg-[#25c95e] text-white' : 'border-2 border-gray-200'}`}>
                    {paymentMethod === "cash" && <FaCheck className="text-xs" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full p-5 rounded-xl border-2 transition-all flex items-center gap-4 group 
                    ${paymentMethod === "online" 
                      ? 'border-[#25c95e] bg-green-50 shadow-sm' 
                      : 'border-gray-200 hover:border-[#25c95e]'}`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl transition-all 
                    ${paymentMethod === "online" ? 'bg-[#25c95e] text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>
                    <FaCreditCard />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-bold text-lg ${paymentMethod === "online" ? 'text-[#25c95e]' : 'text-gray-900'}`}>Pay Online</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Secure payment with Credit/Debit Card</p>
                    <div className="flex items-center gap-2 mt-2">
                      <img alt="Visa" className="h-5" src="https://img.icons8.com/color/48/visa.png" />
                      <img alt="Mastercard" className="h-5" src="https://img.icons8.com/color/48/mastercard.png" />
                      <img alt="Amex" className="h-5" src="https://img.icons8.com/color/48/amex.png" />
                    </div>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all 
                    ${paymentMethod === "online" ? 'bg-[#25c95e] text-white' : 'border-2 border-gray-200'}`}>
                    {paymentMethod === "online" && <FaCheck className="text-xs" />}
                  </div>
                </button>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                   <FaShieldAlt className="text-[#25c95e] text-2xl shrink-0" />
                   <div>
                     <p className="text-sm font-medium text-green-800">Secure & Encrypted</p>
                     <p className="text-xs text-green-600">Your payment info is protected</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm sticky top-4">
              <div className="bg-[#25c95e] px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2"><FaShoppingBag /> Order Summary</h2>
                <p className="text-green-100 text-sm mt-1">{cart.products.length} items</p>
              </div>
              <div className="p-5">
                <div className="space-y-3 max-h-56 overflow-y-auto mb-5 pr-1">
                  {cart.products.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="w-14 h-14 rounded-lg bg-white p-1 border border-gray-100 shrink-0">
                        <img alt={item.product.title} className="w-full h-full object-contain" src={item.product.imageCover} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.count} × {formatePrice(item.price)}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 shrink-0">{formatePrice(item.count * item.price)}</p>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100 my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 text-base">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatePrice(cart.totalCartPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-base">
                    <span className="flex items-center gap-2"><FaTruck className="text-gray-400" /> Shipping</span>
                    <span className="text-[#25c95e] font-semibold">FREE</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#25c95e]">{formatePrice(cart.totalCartPrice)}</span>
                      <span className="text-sm text-gray-500 ml-1">EGP</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="w-full mt-6 bg-[#25c95e] text-white py-6 rounded-xl font-bold text-lg hover:bg-[#1ea04d] transition-all shadow-lg active:scale-[0.98]"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <FaBox className="mr-2" /> {paymentMethod === "cash" ? "Place Order" : "Proceed to Payment"}
                    </>
                  )}
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-4 py-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><FaShieldAlt className="text-green-500"/> Secure</div>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <div className="flex items-center gap-1"><FaTruck className="text-blue-500"/> Fast Delivery</div>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <div className="flex items-center gap-1"><FaBox className="text-orange-500"/> Easy Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}