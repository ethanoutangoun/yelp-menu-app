import CategoryBarItem from "./CategoryBarItem";

const CategoryBar = (props) => {
  const { categories, selected, setSelectedCategory } = props;

  return (
    <div className="border-y py-3 flex items-center justify-between">
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
