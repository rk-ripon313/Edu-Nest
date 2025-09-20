import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const ItemOverviewCard = ({ title, category, price, isPublished, type }) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Badge
            className={"text-lg text-white font-sora font-semibold"}
            variant={type === "Book" ? "default" : "secondary"}
          >
            {type}
          </Badge>
        </div>

        <p className="text-muted-foreground">
          Category: {category?.label} • Group: {category?.group} • Subject:{" "}
          {category?.subject}
          {category?.part && ` • Part: ${category?.part}`}
        </p>

        <p className="text-lg font-semibold">৳ {price}</p>

        <span
          variant={isPublished ? "success" : "destructive"}
          className={`px-2 py-1 rounded text-sm ${
            isPublished
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </CardContent>
    </Card>
  );
};

export default ItemOverviewCard;
