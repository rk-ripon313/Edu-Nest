import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ItemBreadcrumb = ({ subNav, title }) => {
  const formattedSubNav =
    subNav.charAt(0).toUpperCase() + subNav.slice(1).toLowerCase();

  return (
    <div className="container pt-6">
      <Breadcrumb
        className="mb-6 flex flex-wrap items-center space-x-1 md:space-x-2"
        style={{ listStyle: "none" }}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-sm font-medium">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/${subNav.toLowerCase()}`}
            className="text-sm font-medium"
          >
            {formattedSubNav}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
};

export default ItemBreadcrumb;
