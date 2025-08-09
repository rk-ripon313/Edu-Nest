"use client";

import {
  updateUserField,
  updateUserName,
} from "@/app/actions/account/accountActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usernameSchema } from "@/lib/validators/username-schema";
import { Pencil, Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ProfileForm = ({ user }) => {
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    userName: user.userName || "",
  });
  const [error, setError] = useState("");

  const usernameRef = useRef(null);
  const firstNameRef = useRef(null);

  // Auto-focus with cursor at end
  useEffect(() => {
    const focusAndMoveToEnd = (inputRef) => {
      if (inputRef?.current) {
        const input = inputRef.current;
        input.focus();
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    };

    if (editingField === "userName") {
      focusAndMoveToEnd(usernameRef);
    }
    if (editingField === "name") {
      focusAndMoveToEnd(firstNameRef);
    }
  }, [editingField]);

  const handleEdit = (field) => {
    if (editingField && editingField !== field) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        userName: user.userName || "",
      });
      setError("");
    }

    setEditingField(field);
    setError("");
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      userName: user.userName || "",
    });
    setEditingField(null);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSave = async () => {
    if (editingField === "userName") {
      const validation = usernameSchema.safeParse(formData.userName);
      if (!validation.success) {
        setError(validation.error.issues[0].message);
        return;
      }

      try {
        const res = await updateUserName(formData.userName);

        if (res?.success) {
          setEditingField(null);
          toast.success("Username updated successfully!");
        }
      } catch (err) {
        setError(err?.message);
        toast.error(
          err?.message || "Username already exists or failed to update."
        );
      }
    } else if (editingField === "name") {
      try {
        const res = await updateUserField({
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        if (res.success) {
          setEditingField(null);
          toast.success("Name Update Successfully");
        } else {
          toast.error("Failed to update name");
        }
      } catch (err) {
        console.error(err?.message);
        toast.error(err?.message || "Failed!");
      }
    }
  };

  return (
    <div className="w-full mx-auto p-4 space-y-10">
      {/* Username & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username */}
        <div className="flex flex-col gap-3">
          {/* user name */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Username</label>
            <Input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              disabled={editingField !== "userName"}
              ref={usernameRef}
            />
            {error && editingField === "userName" && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          {/* Username Buttons */}
          <div className="flex justify-start">
            {editingField === "userName" ? (
              <>
                <Button size="sm" onClick={handleSave} className="mr-2">
                  <Save size={16} className="mr-1" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X size={16} className="mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit("userName")}
              >
                <Pencil size={16} className="mr-1" />
                Edit Username
              </Button>
            )}
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="text-sm  mb-1 block">Email</label>
          <Input value={user.email} disabled className="" />
        </div>
      </div>

      {/* First & Last Name */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              First Name
            </label>
            <Input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={editingField !== "name"}
              ref={firstNameRef}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Last Name
            </label>
            <Input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={editingField !== "name"}
            />
          </div>
        </div>

        {/* Name Buttons */}
        <div className="flex justify-start">
          {editingField === "name" ? (
            <>
              <Button size="sm" onClick={handleSave} className="mr-2">
                <Save size={16} className="mr-1" />
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X size={16} className="mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit("name")}
            >
              <Pencil size={16} className="mr-1" />
              Edit Name
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
