import ItemBreadcrumb from "@/components/details/ItemBreadcrumb";
import ItemDetails from "@/components/details/ItemDetails";
import RelatedItems from "@/components/details/RelatedItems";
import ReviewSection from "@/components/details/ReviewSection";
import { getBookById } from "@/database/queries/books-data";
import { notFound } from "next/navigation";

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
