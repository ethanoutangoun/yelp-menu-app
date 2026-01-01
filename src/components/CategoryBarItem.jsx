const CategoryBarItem = (props) => {
  const { category, selected, setSelectedCategory } = props;
  return (
    <div
      onClick={()=>setSelectedCategory(category)}
      className={`py-2 text-gray-800 dark:text-gray-200 text-sm hover:cursor-pointer hover:underline transform duration-300 ease-in-out transition-colors duration-200 ${
        selected === category && "font-semibold"
      }`}
    >
      {category}
    </div>
  );
};

export default CategoryBarItem;
