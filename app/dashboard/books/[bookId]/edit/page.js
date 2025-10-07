import { getUniqueCategories } from "@/database/queries/categories-data";
import { getEducatorBookInfobyId } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";
import BookHeaderControls from "../../components/BookHeaderControls";
import CategoryForm from "../../components/CategoryForm";
import DescriptionForm from "../../components/DescriptionForm";
import EditableListForm from "../../components/EditableListForm";
import PriceForm from "../../components/PriceForm";
import TitleForm from "../../components/TitleForm";

const EditBookPage = async ({ params: { bookId } }) => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const book = await getEducatorBookInfobyId(bookId, user?.id);
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
    <div className=" rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between  px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold font-grotesk">Edit Book</h1>
          <p className=" mt-1">Manage your book information</p>
        </div>
        <BookHeaderControls book={book} />
      </div>

      {/* Book Edit Form */}
      <div className="bg-white dark:bg-slate-950">
        {/* Basic Information */}
        <div className="px-6 py-4  border-b border-gray-200">
          <h2 className="text-lg font-semibold ">Basic Information</h2>

          <TitleForm title={book?.title} bookId={book?.id} />
          <DescriptionForm description={book?.description} bookId={book?.id} />
          <PriceForm price={book?.price} bookId={book?.id} />
        </div>

        {/* Category Information */}
        <div className="px-6 py-4  border-b border-gray-200">
          <h2 className="text-lg font-semibold ">Category</h2>

          <CategoryForm
            category={book.category}
            categories={categories}
            bookId={book?.id}
          />
        </div>

        {/* Additional Information */}
        <div className="px-6 py-4  border-b border-gray-200">
          <h2 className="text-lg font-semibold ">Additional Info</h2>

          <EditableListForm
            items={book?.outcomes}
            type="outcomes"
            bookId={book?.id}
          />
          <EditableListForm items={book?.tags} type="tags" bookId={book?.id} />
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;
