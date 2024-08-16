/* eslint-disable react/prop-types */

import { Dot, Utensils } from "lucide-react";

const Card = (props) => {
  const { id, image_url, name, location, rating, business_hours, review_count  } = props;
  return (
    <div key={id} className="group aspect-video relative hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out select-none bg-gray-100 rounded-md">
      {image_url ? <img
        src={image_url}
        alt={name}
        className="object-cover w-full h-48 rounded-t-md"
      /> : 
      <div className="w-full h-48 bg-gray-300 rounded-t-md flex items-center justify-center">
        <Utensils className="w-16 h-16 text-gray-500" />
      </div>
      }
      <div className="p-4">
        <div className="flex items-center gap-1">
          <h2 className="font-bold text-lg group-hover:text-blue-500">
            {name}
          </h2>

          <Dot size={16} />

          <div className="flex items-center gap-1">
            {/* <Star size={16} /> */}
            <p className="text-sm text-gray-500">{rating} stars</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          {location.display_address[0]}, {location.display_address[1]}
        </p>
      </div>

      <div className="absolute top-2 right-2 p-2 bg-white rounded-lg text-xs">
        <p>{review_count} reviews</p>
      </div>
    </div>
  );
};

export default Card;
