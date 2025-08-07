"use client";

import { updateUsername } from "@/app/actions/account/accountActions";
import { updateEducatorInfo } from "@/app/actions/account/educatorAction";
import { EducatorSchema } from "@/lib/validators/educator-schema";
import { usernameSchema } from "@/lib/validators/username-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const BecomeEducator = ({
  currentUserName = "",
  initialData = {},
  isEditMode = false,
}) => {
  const router = useRouter();
  const userNameInputRef = useRef(null);

  const [userName, setUserName] = useState(currentUserName);
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [userNameError, setUserNameError] = useState("");
  const [userNameLoading, setUserNameLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(EducatorSchema),
    defaultValues: {
      bio: initialData.bio || "",
      expertise: initialData.expertise?.join(", ") || "",
      qualification: initialData.qualification || "",
      facebook: initialData.socialLinks?.facebook || "",
      linkedin: initialData.socialLinks?.linkedin || "",
      website: initialData.socialLinks?.website || "",
    },
  });

  const handleEditClick = () => {
    setIsEditingUserName(true);
    setTimeout(() => userNameInputRef.current?.focus(), 100);
  };

  const saveUserName = async () => {
    setUserNameError("");
    const trimmed = userName.trim();
    const validation = usernameSchema.safeParse(trimmed);

    if (!validation.success) {
      setUserNameError(validation.error.issues[0].message);
      return;
    }

    setUserNameLoading(true);
    try {
      const res = await updateUsername(trimmed);
      if (res?.success) {
        setIsEditingUserName(false);
        toast.success("Username updated successfully!");
      }
    } catch (err) {
      setUserNameError(err?.message || "Failed to save username");
      toast.error(err?.message || "Failed to save username");
    } finally {
      setUserNameLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!userName) {
      setUserNameError("Please save your username first.");
      return;
    }

    setFormLoading(true);
    try {
      const res = await updateEducatorInfo({ ...data });
      if (res?.success) {
        toast.success("Educator profile updated successfully!");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="mx-auto p-1">
      {/* Username */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Set Your Username</h2>
        {!isEditingUserName ? (
          <div className="flex items-center gap-4">
            <p className="font-medium">{userName || "No username set"}</p>
            <button
              onClick={handleEditClick}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {userName ? "Edit" : "Create"}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <input
                ref={userNameInputRef}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={userNameLoading}
                placeholder="Enter username"
                className="border rounded px-3 py-2 w-full max-w-xs md:max-w-sm"
              />
              <button
                onClick={saveUserName}
                disabled={userNameLoading}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {userNameLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditingUserName(false);
                  setUserName(currentUserName);
                  setUserNameError("");
                }}
                disabled={userNameLoading}
                className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
            {userNameError && (
              <p className="text-red-600 mt-1 max-w-xs md:max-w-sm text-sm">
                {userNameError}
              </p>
            )}
          </>
        )}
      </section>

      {/* Educator Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Educator Profile Information
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Bio</label>
            <textarea
              {...register("bio")}
              rows={4}
              className="w-full border rounded px-3 py-2 resize-none"
            />
            {errors.bio && (
              <p className="text-red-600 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Expertise</label>
            <input
              {...register("expertise")}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Math, Physics"
            />
            {errors.expertise && (
              <p className="text-red-600 text-sm mt-1">
                {errors.expertise.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Qualification</label>
            <input
              {...register("qualification")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.qualification && (
              <p className="text-red-600 text-sm mt-1">
                {errors.qualification.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Facebook</label>
              <input
                {...register("facebook")}
                className="w-full border rounded px-3 py-2"
              />
              {errors.facebook && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.facebook.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">LinkedIn</label>
              <input
                {...register("linkedin")}
                className="w-full border rounded px-3 py-2"
              />
              {errors.linkedin && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.linkedin.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Website</label>
              <input
                {...register("website")}
                className="w-full border rounded px-3 py-2"
              />
              {errors.website && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.website.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              formLoading ||
              isSubmitting ||
              isEditingUserName ||
              !userName.trim()
            }
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {formLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : isEditMode ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Create Educator Profile</span>
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default BecomeEducator;
