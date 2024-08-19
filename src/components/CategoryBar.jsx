import CategoryBarItem from "./CategoryBarItem";

const CategoryBar = (props) => {
  const { categories, selected, setSelectedCategory } = props;

  return (
    <div className="border-y py-3 flex items-center sm:justify-between gap-7 overflow-auto">
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
