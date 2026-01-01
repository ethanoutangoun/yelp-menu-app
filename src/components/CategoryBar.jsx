import CategoryBarItem from "./CategoryBarItem";

const CategoryBar = (props) => {
  const { categories, selected, setSelectedCategory } = props;

  return (
    <div className="border-y border-gray-200 dark:border-gray-700 py-3 flex items-center sm:justify-between gap-7 overflow-auto transition-colors duration-200">
      {categories.map((category, index) => (
        <CategoryBarItem
          key={index}
          category={category}
          selected={selected}
          setSelectedCategory={setSelectedCategory}
        />
      ))}
    </div>
  );
};

export default CategoryBar;
