"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FaMapMarkerAlt, FaPlus, FaPen, FaTrash, FaPhone, FaCity, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

import { addressService, Address, AddressPayload } from "@/services/address.service";

export default function AddressesPage() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState<AddressPayload>({
    name: "",
    details: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    if (session?.accessToken) {
      loadAddresses();
    } else {
      setLoading(false);
    }
  }, [session]);


  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressService.getAddresses(session?.accessToken || "");
      setAddresses(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({ name: "", details: "", phone: "", city: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = session?.accessToken || "";

    try {
      if (editingAddress) {
        await addressService.updateAddress(token, editingAddress._id, formData);
        toast.success("Address updated successfully");
      } else {
        await addressService.addAddress(token, formData);
        toast.success("Address added successfully");
      }
      setIsModalOpen(false);
      loadAddresses();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      await addressService.deleteAddress(session?.accessToken || "", id);
      toast.success("Address deleted");
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-green-600 text-3xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your saved delivery addresses</p>
        </div>
        <Button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25"
        >
          <FaPlus className="text-sm" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
            <FaMapMarkerAlt className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Addresses Yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Add your first delivery address to make checkout faster and easier.
          </p>
          <Button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            <FaPlus />
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                    <FaMapMarkerAlt className="text-lg text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1">{address.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{address.details}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <FaPhone className="text-xs" />
                        {address.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaCity className="text-xs" />
                        {address.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(address)}
                    className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600 flex items-center justify-center transition-colors"
                    title="Edit address"
                  >
                    <FaPen className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                    title="Delete address"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {editingAddress ? "Update your address details below." : "Fill in the details to add a new address."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Address Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Home, Office"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">Full Address</Label>
              <Textarea
                id="details"
                name="details"
                placeholder="Street, building, apartment..."
                rows={3}
                value={formData.details}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500/20 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Cairo"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 border-0"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25"
              >
                {isSubmitting ? <FaSpinner className="animate-spin mx-auto" /> : (editingAddress ? "Save Changes" : "Add Address")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}