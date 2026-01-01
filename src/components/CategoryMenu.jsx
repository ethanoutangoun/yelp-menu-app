// Renders the menu item for a certain category
import { StarIcon } from "lucide-react";

const CategoryMenu = (props) => {
  const { items } = props;

  return (
    <div className="mt-5 flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={index} className="p-2 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:cursor-pointer transition-colors duration-200 rounded-md">
          {item.item}

          <div className="flex items-center gap-1 mt-1">
            <p className="text-gray-700 dark:text-gray-300">{item.rating.toFixed(1)}</p>
            {Array.from({ length: item.rating }, (_, i) => (
              <StarIcon
                key={i}
                size={16}
                className="text-[#c33c3c] dark:text-red-400"
                fill="#c33c3c"
              />
            ))}

            <p className="text-gray-700 dark:text-gray-300">({item.reviews})</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
