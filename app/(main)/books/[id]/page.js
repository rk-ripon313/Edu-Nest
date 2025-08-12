import ItemBreadcrumb from "@/components/details/ItemBreadcrumb";
import ItemDetails from "@/components/details/ItemDetails";
import SectionLoadingFallback from "@/components/SectionLoadingFallback";
import { getBookById } from "@/database/queries/books-data";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Dynamic Imports
const ReviewSection = dynamic(
  () => import("@/components/details/ReviewSection"),
  { suspense: true }
);
const RelatedItems = dynamic(
  () => import("@/components/details/RelatedItems"),
  { suspense: true }
);

export const generateMetadata = async ({ params: { id } }) => {
  const book = await getBookById(id);

  if (!book) {
    return {
      title: "Book Not Found | EduNest",
      description: "No book found with the provided ID.",
    };
  }

  return {
    title: `${book.title} | EduNest`,
    description:
      book.description?.slice(0, 160) || "Explore this book on EduNest.",
    openGraph: {
      title: `${book.title} | EduNest`,
      description: book.description,
      images: [
        {
          url: book.thumbnail,
          width: 800,
          height: 600,
          alt: book.title,
        },
      ],
    },
  };
};

const BookDetailsPage = async ({ params: { id } }) => {
  const book = await getBookById(id);
  if (!book) notFound();

  return (
    <>
      <ItemBreadcrumb subNav="books" title={book.title} />
      <ItemDetails item={book} />

      <Suspense fallback={<SectionLoadingFallback title="Review Section" />}>
        <ReviewSection itemId={id} onModel="Book" />
      </Suspense>

      <Suspense fallback={<SectionLoadingFallback title="Related Books" />}>
        <RelatedItems itemId={id} type="book" tags={book.tags} />
      </Suspense>
    </>
  );
};

export default BookDetailsPage;
