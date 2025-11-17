"use client";
import Empty from "@/components/Empty";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const EducatorTabItems = ({ items = [], type = "book" }) => {
  const defaultVisible = 4;
  const [visibleCount, setVisibleCount] = useState(defaultVisible);

  const toggleVisible = () => {
    setVisibleCount(
      visibleCount >= items.length ? defaultVisible : items.length
    );
  };

  if (!items || items.length === 0)
    return <Empty title=" No items available" />;

  return (
    <div className="mt-4 space-y-6">
      <h2 className="text-xl font-semibold">
        {type === "book" ? "Top Rated Books" : "Top Rated Study Series"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-4 md:gap-5 lg:gap-6">
        {items.slice(0, visibleCount).map((item) => (
          <ItemCard key={item.id} item={item} type={type} />
        ))}
      </div>

      {/* Only show button if items > defaultVisible */}
      {items.length > defaultVisible && (
        <div className="text-center mt-4">
          <Button variant="outline" size="sm" onClick={toggleVisible}>
            {visibleCount >= items.length ? "Show Less" : "Show All"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EducatorTabItems;
