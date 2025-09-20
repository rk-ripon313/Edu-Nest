import { itemInfoColumns } from "@/app/dashboard/components/ItemInfoColumns";
import ItemOverviewCard from "@/app/dashboard/components/ItemOverviewCard";
import ItemsInfoTable from "@/app/dashboard/components/ItemsInfoTable";
import { getEducatorBookInfobyId } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";

const BookDetailsPage = async ({ params: { bookId } }) => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const book = await getEducatorBookInfobyId(bookId, user?.id, true);
  if (!book) return <p>Book not found or access denied</p>;
  // console.log(book.student);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Book Overview */}
      <ItemOverviewCard
        title={book.title}
        category={book.category}
        price={book.price}
        isPublished={book.isPublished}
        type="Book"
      />
      {/* review and enrollments  */}
      <ItemsInfoTable data={book.students || []} columns={itemInfoColumns} />
    </div>
  );
};
export default BookDetailsPage;
