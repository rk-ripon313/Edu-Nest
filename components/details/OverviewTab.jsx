import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { formatDate } from "@/lib/formetData";
const OverviewTab = ({ item }) => {
  return (
    <TabsContent value="overview" className="md:w-5/6 lg:w-4/5 space-y-3">
      <h2 className="text-lg font-semibold mb-2">Overview</h2>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Category:
        </h3>
        <ul className="text-muted-foreground space-y-1 ml-2">
          {item.category?.label && (
            <li>
              <span className="font-medium text-foreground">Label : </span>
              {item?.category?.label}
            </li>
          )}
          {item?.category?.group && (
            <li>
              <span className="font-medium text-foreground">Group : </span>
              {item?.category?.group}
            </li>
          )}
          {item.category?.subject && (
            <li>
              <span className="font-medium text-foreground">Subject : </span>
              {item.category?.subject}
            </li>
          )}
          {item.category?.part && (
            <li>
              <span className="font-medium text-foreground">Part :</span>
              {item.category?.part}
            </li>
          )}
        </ul>
      </div>

      {/* Published & Updated */}
      <ul className="space-y-2">
        <li>
          <strong className="text-foreground">Published:</strong>{" "}
          <span className="text-muted-foreground">
            {formatDate(item?.createdAt)}
          </span>
        </li>
        {item.updatedAt && (
          <li>
            <strong className="text-foreground">Last Updated:</strong>{" "}
            <span className="text-muted-foreground">
              {formatDate(item?.updatedAt)}
            </span>
          </li>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <li>
            <strong className="text-foreground">Tags:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.tags.map((tag, i) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </li>
        )}
      </ul>
    </TabsContent>
  );
};
export default OverviewTab;
