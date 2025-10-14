import { getUniqueCategories } from "@/database/queries/categories-data";
import SeriesCategoryForm from "./CategoryForm";
import SeriesDescriptionForm from "./DescriptionForm";
import SeriesEditableListForm from "./EditableListForm";
import SeriesPriceForm from "./PriceForm";
import SeriesTitleForm from "./TitleForm";

const SeriesOverviewTab = async ({ studySeries }) => {
  const categories = await getUniqueCategories();
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

        <SeriesCategoryForm
          category={studySeries.category}
          categories={categories}
          studySeriesId={studySeries?.id}
        />
      </div>

      {/* Additional Information */}
      <div className="px-6 py-4  border-b border-gray-200">
        <h2 className="text-lg font-semibold ">Additional Info</h2>

        <SeriesEditableListForm
          items={studySeries?.outcomes}
          type="outcomes"
          studySeriesId={studySeries?.id}
        />
        <SeriesEditableListForm
          items={studySeries?.tags}
          type="tags"
          studySeriesId={studySeries?.id}
        />
      </div>
    </div>
  );
};
export default SeriesOverviewTab;
