import { getUniqueCategories } from "@/database/queries/categories-data";
import { getEducatorBookInfobyId } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";
import BookHeaderControls from "../../components/BookHeaderControls";

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
    <>
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
      </div>
    </>
  );
};

export default EditBookPage;
