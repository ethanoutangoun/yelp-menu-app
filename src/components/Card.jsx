/* eslint-disable react/prop-types */

import { Dot, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Card = (props) => {
  const { id, alias, image_url, name, location, rating, review_count } = props;
  const navigate = useNavigate();

  const data = { id, alias, image_url, name, location, rating, review_count };

  const address_lines = location?.display_address ?? [];
  const address_text = address_lines.filter(Boolean).join(", ");

  return (
    <div
      onClick={() => navigate(`/restaurant/${alias}`, { state: data })}
      key={id}
      className="
        group aspect-video relative hover:cursor-pointer select-none
        bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden
        transition duration-300 ease-in-out
        md:hover:scale-[1.02]
      "
    >
      {/* Fill the fixed 16:9 card with a 2-row layout */}
      <div className="grid h-full grid-rows-[3fr_2fr]">
        {/* IMAGE ROW (no fixed px height) */}
        <div className="relative min-h-0">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 flex items-center justify-center transition-colors duration-200">
              <Utensils className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>

        {/* CONTENT ROW (prevent overflow) */}
        <div className="min-w-0 min-h-0 p-3 sm:p-4 overflow-hidden">
          <div className="flex items-start gap-1 min-w-0">
            <h2
              className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 min-w-0 flex-1 truncate transition-colors duration-200"
              title={name}
            >
              {name}
            </h2>

            <Dot size={16} className="shrink-0 mt-1 text-gray-900 dark:text-gray-100" />

            <div className="flex items-center gap-1 shrink-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap transition-colors duration-200">
                {rating} stars
              </p>
            </div>
          </div>

          <p
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 min-w-0 truncate whitespace-nowrap transition-colors duration-200"
            title={address_text}
          >
            {address_text}
          </p>
        </div>
      </div>

      {/* Badge: keep it from overflowing */}
      <div className="absolute top-2 right-2 max-w-[70%] px-2 py-1 bg-white/90 dark:bg-gray-800/90 rounded-lg text-[10px] sm:text-xs transition-colors duration-200">
        <p className="truncate whitespace-nowrap text-gray-900 dark:text-gray-100">{review_count} reviews</p>
      </div>
    </div>
  );
};

export default Card;
