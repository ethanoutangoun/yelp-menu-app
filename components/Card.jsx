/* eslint-disable react/prop-types */
const Card = (props) => {
  const { id, alias, image_url, name, location } = props;
  return <div className="group aspect-video relative hover:cursor-pointer hover:scale-105 transition duration-300 ease-in-out select-none bg-gray-100 rounded-md">
    <img src={image_url} alt={name} className="object-cover w-full h-48 rounded-t-md" />
    <div className="p-4">
      <h2 className="font-bold text-lg group-hover:text-blue-500">{name}</h2>
      <p className="text-sm text-gray-500">{location.address1}</p>
    </div>
  </div>;
};

export default Card;
