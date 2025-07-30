import { TabsContent } from "@/components/ui/tabs";
const DescriptionTab = ({ item }) => {
  return (
    <TabsContent value="description" className="md:w-5/6 lg:w-4/5 space-y-3">
      <h2 className="text-xl font-semibold">Description</h2>
      <p className="text-muted-foreground">
        {item.description || "No description available for this item."}
      </p>
      {item.outComes?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium">Learning Outcomes</h3>
          <ul className="list-disc list-inside text-muted-foreground">
            {item.outComes.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </TabsContent>
  );
};
export default DescriptionTab;
