"use client";

import Image from "next/image";

const EducatorSidebar = ({
  blogs,
  educatorSeries = [],
  educatorBooks = [],
}) => {
  return (
    <aside className="hidden lg:block space-y-3 ">
      {/* Educator Stats */}
      <div className="rounded-xl border bg-muted/40 p-4 bg-white dark:bg-gray-800">
        <h4 className="font-semibold mb-3">Educator Overview</h4>
        <div className="grid grid-cols-3 text-center gap-2">
          <div>
            <p className="text-xl font-bold">{blogs.length}</p>
            <p className="text-xs text-muted-foreground">Blogs</p>
          </div>
          <div>
            <p className="text-xl font-bold">{educatorSeries.length}</p>
            <p className="text-xs text-muted-foreground">Series</p>
          </div>
          <div>
            <p className="text-xl font-bold">{educatorBooks.length}</p>
            <p className="text-xs text-muted-foreground">Books</p>
          </div>
        </div>
      </div>

      {/* Featured Series */}
      {educatorSeries.length > 0 && (
        <div className="rounded-xl border bg-white dark:bg-gray-800 p-4 ">
          <h4 className="font-semibold mb-4">Featured Series</h4>
          {educatorSeries.slice(0, 3).map((series) => (
            <div key={series.id} className="flex gap-3 mb-3 items-center">
              <Image
                src={series.thumbnail}
                alt={series.title}
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
              <div className="text-sm">
                <p className="font-medium leading-snug">{series.title}</p>
                <p className="text-xs text-muted-foreground">৳{series.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured Books */}
      {educatorBooks.length > 0 && (
        <div className="rounded-xl border bg-white dark:bg-gray-800 p-4">
          <h4 className="font-semibold mb-4">Featured Books</h4>
          {educatorBooks.slice(0, 3).map((book) => (
            <div key={book.id} className="flex gap-3 mb-3 items-center">
              <Image
                src={book.thumbnail}
                alt={book.title}
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
              <div className="text-sm">
                <p className="font-medium leading-snug">{book.title}</p>
                <p className="text-xs text-muted-foreground">৳{book.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default EducatorSidebar;
