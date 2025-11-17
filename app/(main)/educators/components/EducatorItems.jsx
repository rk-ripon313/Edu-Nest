import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { getEducatorProfileItems } from "@/database/queries/educator-data";
const EducatorItems = async ({ educatorId }) => {
  const educatorBooks =
    (await getEducatorProfileItems(educatorId, "Book", 2)) || [];

  const educatorSeries =
    (await getEducatorProfileItems(educatorId, "StudySeries", 2)) || [];
  // console.log({ educatorBooks }, { educatorSeries });

  return (
    <>
      {/* SERIES SECTION */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Top Rated Study Series</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {educatorSeries.length
            ? educatorSeries.map((item) => (
                <ItemCard key={item.id} item={item} type="series" />
              ))
            : "No Series Available"}
        </div>

        <div className="text-center mt-3">
          <Button variant="outline" size="sm">
            More Series
          </Button>
        </div>
      </div>

      {/* BOOKS SECTION */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Top Rated Books</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {educatorBooks.length
            ? educatorBooks.map((item) => (
                <ItemCard key={item.id} item={item} type="book" />
              ))
            : "No Books Available"}
        </div>

        <div className="text-center mt-3">
          <Button variant="outline" size="sm">
            More Books
          </Button>
        </div>
      </div>
    </>
  );
};
export default EducatorItems;
