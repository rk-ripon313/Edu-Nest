import ItemBreadcrumb from "@/components/details/ItemBreadcrumb";
import ItemDetails from "@/components/details/ItemDetails";
import RelatedItems from "@/components/details/RelatedItems";
import ReviewSection from "@/components/details/ReviewSection";
import { getBookById } from "@/database/queries/books-data";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params: { id } }) => {
  const book = await getBookById(id);

  if (!book) {
    return {
      title: "Book Not Found | EduNest",
      description: "No book found with the provided ID.",
    };
  }

  const coverImage = book?.thumbnail;

  return {
    title: `${book.title} | EduNest`,
    description: `${
      book.description?.slice(0, 160) || "Explore this book on EduNest."
    }`,
    openGraph: {
      title: `${book.title} | EduNest`,
      description: book.description,
      images: [
        {
          url: coverImage,
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
  // console.log(book);
  if (!book) notFound();
  return (
    <>
      <ItemBreadcrumb subNav={"books"} title={book.title} />
      <ItemDetails item={book} />
      <ReviewSection itemId={id} onModel={"Book"} />
      <RelatedItems itemId={id} type="book" tags={book.tags} />
    </>
  );
};
export default BookDetailsPage;
