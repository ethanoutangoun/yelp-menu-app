// Renders the menu item for a certain category
import { StarIcon } from "lucide-react";

const CategoryMenu = (props) => {
  const { items } = props;

  console.log(items);

  return (
    <div className="mt-5 flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={index} className="p-2 border text-sm">
          {item.item}

          <div className="flex items-center gap-1">

            <p>{item.rating.toFixed(1)}</p>
            {Array.from({ length: item.rating }, (_, i) => (
              <StarIcon key={i} size={16} className="text-[#c33c3c]" fill="#c33c3c"  />
            ))}

            <p>({item.reviews})</p>

          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
