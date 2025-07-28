"use client";

import { Button } from "../ui/button";

const ActionBtns = () => {
  return (
    <div className="flex gap-5 ">
      <Button variant="outline">Add to Wishlist</Button>
      <Button variant="default" className="font-sora font-medium ">
        Enroll Now
      </Button>
    </div>
  );
};
export default ActionBtns;
