const CategoryBarItem = (props) => {
  const { category, selected, setSelectedCategory } = props;
  return (
    <div
      onClick={()=>setSelectedCategory(category)}
      className={`py-2 text-gray-800 text-sm hover:cursor-pointer transform duration-300 ease-in-out ${
        selected === category && "font-semibold"
      }`}
    >
      {category}
    </div>
  );
};

export default CategoryBarItem;
