import ReviewAction from "@/components/details/ReviewAction";
import ReviewList from "@/components/details/ReviewList";
import Empty from "@/components/Empty";
import Spinner from "@/components/ui/Spinner";
import { getHasEnrollment } from "@/database/queries/enrollments-data";
import { getTestimonials } from "@/database/queries/testimonials-data";
import { getCurrentUser } from "@/lib/session";
import { BookModel } from "@/models/book-model";
import { Bookmark } from "lucide-react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const PDFViewer = dynamic(() => import("./components/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center flex-col m-auto gap-2">
      <p> Loading PDF viewer...</p>
      <Spinner />
    </div>
  ),
});

const BookReadPage = async ({ params: { id } }) => {
  const [user, book, hasEnrollment, testimonials] = await Promise.all([
    getCurrentUser(),
    BookModel.findOne({ _id: id, isPublished: true })
      .select("fileUrl title")
      .lean(),
    getHasEnrollment("Book", id),
    getTestimonials("Book", id),
  ]);

  if (!user) return redirect("/login");

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty title="This book is no longer available" />
      </div>
    );
  }

  if (!hasEnrollment) return redirect(`/books/${id}`);

  const writedReview = testimonials.find(
    ({ student }) => student?._id?.toString() === user.id
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white  ">
          {book.title}
        </h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bookmark className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>

      {/* Responsive Layout */}
      <div className=" flex flex-col lg:flex-row gap-6 p-6 justify-between ">
        {/* Left (PDF Viewer) */}
        <PDFViewer fileUrl={book.fileUrl} />

        {/* Right (Review Section ) */}
        <div
          className="lg:w-[40%] flex flex-col items-center  lg:items-start justify-center space-y-4 
          p-2 bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <ReviewAction onModel={"Book"} review={writedReview} itemId={id} />
          <ReviewList reviews={testimonials} isRead={true} />
        </div>
      </div>
    </div>
  );
};

export default BookReadPage;
