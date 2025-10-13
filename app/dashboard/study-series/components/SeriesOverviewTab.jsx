import SeriesDescriptionForm from "./DescriptionForm";
import SeriesPriceForm from "./PriceForm";
import SeriesTitleForm from "./TitleForm";

const SeriesOverviewTab = ({ studySeries }) => {
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Basic Information */}
      <div className="px-6 py-4  border-b border-gray-200">
        <h2 className="text-lg font-semibold ">Basic Info</h2>

        <SeriesTitleForm
          title={studySeries?.title}
          studySeriesId={studySeries?.id}
        />
        <SeriesDescriptionForm
          description={studySeries?.description}
          studySeriesId={studySeries?.id}
        />
        <SeriesPriceForm
          price={studySeries?.price}
          studySeriesId={studySeries?.id}
        />
      </div>

      {/* Category Information */}
      <div className="px-6 py-4  border-b border-gray-200">
        <h2 className="text-lg font-semibold ">Category Info</h2>
      </div>

      {/* Additional Information */}
      <div className="px-6 py-4  border-b border-gray-200">
        <h2 className="text-lg font-semibold ">Additional Info</h2>
      </div>
    </div>
  );
};
export default SeriesOverviewTab;
