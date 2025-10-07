"use client";

import { updateABook } from "@/app/actions/boook.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EditableListForm = ({ items = [], type, bookId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [list, setList] = useState(items);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return setError(`Please enter a ${type}`);

    // OUTCOMES validation
    if (type === "outcomes") {
      if (trimmed.length < 4)
        return setError("Outcome must be at least 4 characters long");
      if (trimmed.length > 100)
        return setError("Outcome cannot exceed 100 characters");
      if (list.length >= 10)
        return setError("You cannot add more than 10 outcomes");
    }

    // TAGS validation
    if (type === "tags") {
      if (trimmed.length < 2)
        return setError("Tag must be at least 2 characters long");
      if (trimmed.length > 20)
        return setError("Tag cannot exceed 20 characters");
      if (list.length >= 5) return setError("You cannot add more than 5 tags");
    }

    setList([...list, trimmed]);
    setNewItem("");
    setError("");
  };

  const handleRemove = (index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await updateABook(bookId, { [type]: list });

      if (result?.success) {
        toggleEdit();
        router.refresh();
        toast.success(result.message || `Book ${type} has been updated.`);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4  ">
      {/* Header */}
      <div className="font-medium flex items-center justify-between">
        {`Book ${type} `}

        {isEditing ? (
          <Button
            variant="ghost"
            onClick={() => {
              setList(items);
              setNewItem("");
              setError("");
              setIsEditing((p) => !p);
            }}
            className="border"
          >
            Cancel
          </Button>
        ) : (
          <Button variant="ghost" onClick={toggleEdit} className="border">
            <Pencil className="h-4 w-4 mr-2" /> Edit {type}{" "}
          </Button>
        )}
      </div>

      {/* ---------- View Mode ---------- */}
      {!isEditing && (
        <>
          {type === "tags" ? (
            <div className="flex flex-wrap gap-2">
              {list.length ? (
                list.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    #{t}
                  </div>
                ))
              ) : (
                <p className=" text-sm">No tags added yet.</p>
              )}
            </div>
          ) : (
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              {list.length ? (
                list.map((o, i) => <li key={i}>{o}</li>)
              ) : (
                <p className=" text-sm">No outcomes added yet.</p>
              )}
            </ol>
          )}
        </>
      )}

      {/* ---------- Edit Mode ---------- */}
      {isEditing && (
        <div className="space-y-4 mt-4">
          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Add new ${type}...`}
              className="flex-1"
            />
            <Button type="button" onClick={handleAdd} variant="outline">
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* List Display */}

          <div
            className={`${
              type === "tags" ? "flex flex-wrap gap-2" : "flex flex-col gap-2"
            }`}
          >
            {list.length ? (
              list.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center ${
                    type === "tags"
                      ? "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                      : "justify-between bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md text-sm"
                  }`}
                >
                  <span className="flex-1">
                    {type === "tags" ? `#${item}` : item}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="ml-2 text-gray-500 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm">
                No {type === "tags" ? "tags" : "outcomes"} added yet.
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default EditableListForm;
