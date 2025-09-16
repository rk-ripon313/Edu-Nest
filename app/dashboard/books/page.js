import { getEducatorBooks } from "@/database/queries/dashboard-data";
import { getCurrentUser } from "@/lib/session";
import { bookColumns } from "./components/BookColumns";
import BooksTable from "./components/BooksTable";

const BookListPage = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== "educator") return <p>Access Denied</p>;

  const books = await getEducatorBooks(user?.id, true);
  // console.log({ books });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Books</h1>
      </div>

      <BooksTable data={books} columns={bookColumns} />
    </div>
  );
};
export default BookListPage;
