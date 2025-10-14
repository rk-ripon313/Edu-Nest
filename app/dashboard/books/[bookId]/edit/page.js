import CategoryForm from "@/app/dashboard/components/CategoryForm";
import DescriptionForm from "@/app/dashboard/components/DescriptionForm";
import EditableListForm from "@/app/dashboard/components/EditableListForm";
import ItemHeaderControls from "@/app/dashboard/components/ItemHeaderControls";
import PdfForm from "@/app/dashboard/components/PdfForm";
import PriceForm from "@/app/dashboard/components/PriceForm";
import ThumbnailForm from "@/app/dashboard/components/ThumbnailForm";
import TitleForm from "@/app/dashboard/components/TitleForm";

import { getUniqueCategories } from "@/database/queries/categories-data";
import { getEducatorItemInfobyId } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";

const EditBookPage = async ({ params: { bookId } }) => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const book = await getEducatorItemInfobyId("Book", bookId, user?.id);
  if (!book) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book Not Found
          </h1>
          <p className="text-gray-500">
            {`The book you're looking for doesn't exist.`}
          </p>
        </div>
      </div>
    );
  }

  const categories = await getUniqueCategories();
  // console.log({ book });

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 ">
      {/* Header */}
      <div className="flex items-center justify-between  px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold font-grotesk">Edit Book</h1>
          <p className=" mt-1">Manage your book information</p>
        </div>
        <ItemHeaderControls item={book} onModel="Book" />
      </div>

      {/* Book Edit Form */}
      <div className="bg-white dark:bg-slate-950">
        {/* Basic Information */}
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold ">Basic Info</h2>

          <TitleForm title={book?.title} itemId={book?.id} onModel="Book" />
          <DescriptionForm
            description={book?.description}
            itemId={book?.id}
            onModel="Book"
          />
          <PriceForm price={book?.price} itemId={book?.id} onModel="Book" />
        </div>

        {/* Category Information */}
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold ">Category Info</h2>

          <CategoryForm
            category={book.category}
            categories={categories}
            itemId={book?.id}
            onModel="Book"
          />
        </div>

        {/* Additional Information */}
        <div className="px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold ">Additional Info</h2>

          <EditableListForm
            items={book?.outcomes}
            type="outcomes"
            itemId={book?.id}
            onModel="Book"
          />

          <EditableListForm
            items={book?.tags}
            type="tags"
            itemId={book?.id}
            onModel="Book"
          />
        </div>

        {/* File Information */}
        <div className="px-6 py-3  border-b border-gray-200">
          <h2 className="text-lg font-semibold ">File Info</h2>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail */}
            <ThumbnailForm
              thumbnailUrl={book?.thumbnail}
              itemId={book?.id}
              onModel="Book"
            />
            {/* PDF File Section  (read-only) */}
            <PdfForm title={book?.title} fileUrl={book?.fileUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;
