import { getTopRatedStudySeries } from "@/database/queries/study-series-data";
import { SectionHeader } from "../SectionHeader";
import SectionWrapper from "../SectionWrapper";
import SwiperSlider from "../SwiperSlider";

const TopRatedSeries = async () => {
  const series = await getTopRatedStudySeries();
  return (
    <SectionWrapper even={true}>
      <SectionHeader
        title="Top Rated Study-Series "
        subtitle="Highest rated series by our students"
      />

      <SwiperSlider items={series} type="series" />
    </SectionWrapper>
  );
};
export default TopRatedSeries;
