import { Trophy, StarIcon } from "lucide-react";

const HighlightCard = (props) => {
  const { item, rating, num_reviews, type } = props;

  const parse_type = (type) => {
    if (type === "most_reviewed") {
      return "Most Reviewed";
    } else if (type === "highest_rated") {
      return "Highest Rated";
    } else {
      return type;
    }
  };

  return (
    <div className="h-32 w-72 min-w-72 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col items-center justify-around p-2 transition-colors duration-200">
      <Trophy size={32} className="text-orange-400" />

      <div className="flex flex-col items-center">
        <h5 className="flex items-center gap-1 text-[13px] font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {item}{" "}
          <span className="flex gap-1 items-center font-medium">
            <StarIcon size={16} className="text-[#c33c3c] dark:text-red-400" fill="#c33c3c" />
            {rating} ({num_reviews})
          </span>
        </h5>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{parse_type(type)}</p>
      </div>
    </div>
  );
};

export default HighlightCard;
