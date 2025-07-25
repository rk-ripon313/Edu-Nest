const Empty = ({ title, subTitle }) => {
  return (
    <div
      id="emptyState"
      className="w-full h-full text-center py-16 my-auto flex justify-center items-center"
    >
      <div className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 mx-auto text-moviedb-gray mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
        <h2 className="text-2xl font-bold text-light mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mt-2">{subTitle}</p>
      </div>
    </div>
  );
};
export default Empty;
