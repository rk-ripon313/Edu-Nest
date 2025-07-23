import Categories from "@/components/home/Categories";
import { Hero } from "@/components/home/Hero";
import PopularBooks from "@/components/home/PopularBooks";
import PopularSeries from "@/components/home/PopularSeries";
import TopRatedBooks from "@/components/home/TopRatedBooks";
import TopRatedSeries from "@/components/home/TopRatedSeries";

const MainPage = async () => {
  return (
    <>
      <Hero />
      <Categories />
      <PopularBooks />
      <PopularSeries />
      <TopRatedBooks />
      <TopRatedSeries />
    </>
  );
};
export default MainPage;
