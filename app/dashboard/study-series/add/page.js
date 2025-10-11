import { getUniqueCategories } from "@/database/queries/categories-data";
import StudySeriesForm from "../components/StudySeriesForm";

const AddStudySeriesPage = async () => {
  const categories = await getUniqueCategories();
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Add New Study-Series</h1>
      <StudySeriesForm categories={categories} />
    </>
  );
};
export default AddStudySeriesPage;
