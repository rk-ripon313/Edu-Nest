"use client";

import { updateUserPassword } from "@/app/actions/account/accountActions";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  //submit fun..
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill the  input boxs");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password Mitch Match");
      return;
    }

    try {
      setLoading(true);
      const res = await updateUserPassword(currentPassword, newPassword);
      if (res?.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.error);
      }
    } catch (e) {
      toast.error(e?.message || "Something went rong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
      <div>
        <label className="block mb-1 font-semibold" htmlFor="currentPassword">
          Enter Old Password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          className="w-full max-w-xs border rounded px-3 py-1.5 h-8"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold" htmlFor="newPassword">
          Enter New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full max-w-xs border rounded px-3 py-1.5 h-8"
          required
          disabled={loading}
          minLength={6}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold" htmlFor="confirmPassword">
          Re-Enter New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full max-w-xs border rounded px-3 py-1.5 h-8"
          required
          disabled={loading}
          minLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full max-w-xs bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
