import { Trophy, StarIcon } from "lucide-react";

const HighlightCard = (props) => {
  const { item, rating, reviews, type } = props;

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
    <div className="h-32 w-72 min-w-72 bg-gray-100 rounded-md flex flex-col items-center justify-around p-2 ">
      <Trophy size={32} className="text-orange-400" />

      <div className="flex flex-col items-center">
        <h5 className="flex items-center gap-1 text-[13px] font-semibold">
          {item}{" "}
          <span className="flex gap-1 items-center font-medium">
            <StarIcon size={16} className="text-[#c33c3c]" fill="#c33c3c" />
            {rating} ({reviews})
          </span>
        </h5>
        <p className="text-sm text-gray-500">{parse_type(type)}</p>
      </div>
    </div>
  );
};

export default HighlightCard;
