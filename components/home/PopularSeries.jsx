import { getPopularStudySeries } from "@/database/queries/study-series-data";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import SwiperSlider from "../SwiperSlider";

const PopularSeries = async () => {
  const series = await getPopularStudySeries();
  // console.log(series);

  return (
    <SectionWrapper even={true}>
      <SectionHeader
        title="Popular Study-Series"
        subtitle="Series with the highest enrollment"
      />

      <SwiperSlider items={series} type="series" />
    </SectionWrapper>
  );
};
export default PopularSeries;
