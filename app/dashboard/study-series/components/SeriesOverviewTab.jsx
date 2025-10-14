import CategoryForm from "@/app/dashboard/components/CategoryForm";
import DescriptionForm from "@/app/dashboard/components/DescriptionForm";
import EditableListForm from "@/app/dashboard/components/EditableListForm";
import PriceForm from "@/app/dashboard/components/PriceForm";
import ThumbnailForm from "@/app/dashboard/components/ThumbnailForm";
import TitleForm from "@/app/dashboard/components/TitleForm";

import { getUniqueCategories } from "@/database/queries/categories-data";

const SeriesOverviewTab = async ({ studySeries }) => {
  const categories = await getUniqueCategories();
  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Basic Information */}
      <div className="px-6 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold ">Basic Info</h2>
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <TitleForm
              title={studySeries?.title}
              itemId={studySeries?.id}
              onModel="StudySeries"
            />
            <DescriptionForm
              description={studySeries?.description}
              itemId={studySeries?.id}
              onModel="StudySeries"
            />
            <PriceForm
              price={studySeries?.price}
              itemId={studySeries?.id}
              onModel="StudySeries"
            />
          </div>

          <ThumbnailForm
            thumbnailUrl={studySeries?.thumbnail}
            itemId={studySeries?.id}
            onModel="StudySeries"
          />
        </div>
      </div>

      {/* Category Information */}
      <div className="px-6 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold ">Category Info</h2>

        <CategoryForm
          category={studySeries.category}
          categories={categories}
          itemId={studySeries?.id}
          onModel="StudySeries"
        />
      </div>

      {/* Additional Information */}
      <div className="px-6 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold ">Additional Info</h2>

        <EditableListForm
          items={studySeries?.outcomes}
          type="outcomes"
          itemId={studySeries?.id}
          onModel="StudySeries"
        />

        <EditableListForm
          items={studySeries?.tags}
          type="tags"
          itemId={studySeries?.id}
          onModel="StudySeries"
        />
      </div>
    </div>
  );
};
export default SeriesOverviewTab;
