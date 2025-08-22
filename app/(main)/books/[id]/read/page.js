import Empty from "@/components/Empty";
import { getHasEnrollment } from "@/database/queries/enrollments-data";
import { getCurrentUser } from "@/lib/session";
import { BookModel } from "@/models/book-model";
import { Bookmark } from "lucide-react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const PDFViewer = dynamic(() => import("./components/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center p-8">Loading PDF viewer...</div>
  ),
});

const BookReadPage = async ({ params: { id } }) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const hasEnrollment = await getHasEnrollment("Book", id);
  if (!hasEnrollment) redirect(`/books/${id}`);

  const book = await BookModel.findOne({ _id: id, isPublished: true })
    .select("fileUrl title")
    .lean();

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Empty title={"This book is no longer available"} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white truncate max-w-xs">
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
        <div className="lg:w-[40%] flex flex-col items-center jus lg:items-start space-y-4  p-2"></div>
      </div>
    </div>
  );
};

export default BookReadPage;
