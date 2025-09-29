import { getUniqueCategories } from "@/database/queries/categories-data";
import BookForm from "../components/BookForm";

const AddBookPage = async () => {
  const categories = await getUniqueCategories();
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
      <BookForm categories={categories} />
    </>
  );
};
export default AddBookPage;
