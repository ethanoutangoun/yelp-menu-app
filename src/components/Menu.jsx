import CategoryBar from "./CategoryBar";
import CategoryMenu from "./CategoryMenu";
import { useState } from "react";

const Menu = (props) => {
  const { menu } = props;

  // Set intitial category to the first one on the list
  const [selectedCategory, setSelectedCategory] = useState(menu[0].category);

  const categories = menu.map((item) => item.category);

  // filter out category object for selected category
  const category = menu.filter((item) => item.category === selectedCategory)[0];

  // destructure items into own list to pass in as props
  const items = category.items;


  return (
    <div>
      <h3 className="my-2 font-semibold">Menu</h3>

      <CategoryBar
        categories={categories}
        selected={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <CategoryMenu items={items} />
    </div>
  );
};

export default Menu;
