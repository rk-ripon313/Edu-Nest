"use client";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Empty from "./Empty";
import ItemCard from "./ItemCard";

const SwiperSlider = ({ items = [], type }) => {
  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center dark:bg-slate-800 bg-gray-300 rounded-xl">
        <Empty title={"No related items found."} />
      </div>
    );
  }
  return (
    <div className="relative ">
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView="auto"
        freeMode={true}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        loop={true}
        className="!py-2 !px-2 dark:bg-slate-800 bg-gray-300 rounded-xl"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="!w-64">
            <ItemCard item={item} type={type} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="swiper-button-prev !left-0 !text-white !bg-accent hover:scale-95 !w-10 !h-10 rounded-full after:!text-xl after:!font-bold" />
      <div className="swiper-button-next !right-0 !text-white !bg-accent hover:scale-95  !w-10 !h-10 rounded-full after:!text-xl after:!font-bold" />
    </div>
  );
};

export default SwiperSlider;
