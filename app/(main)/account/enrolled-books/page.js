import { getEnrolledItems } from "@/database/queries/enrollments-data";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import EnrolledItemCard from "../components/EnrolledItemCard";
import SearchSortBar from "../components/SearchSortBar";

const EnrolledBooksPage = async ({ searchParams }) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const books = await getEnrolledItems(user?.id, "Book", {
    ...searchParams,
  });
  // console.log(books);

  return (
    <section className="max-w-5xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold font-grotesk">
          My Enrolled Books
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here are the books you have enrolled in. Click to read anytime.
        </p>
      </header>

      <SearchSortBar />

      <div className="space-y-6">
        {books.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">
            No enrolled books found.
          </p>
        ) : (
          books.map((book) => (
            <EnrolledItemCard key={book.id} item={book} type="book" />
          ))
        )}
      </div>
    </section>
  );
};

export default EnrolledBooksPage;
