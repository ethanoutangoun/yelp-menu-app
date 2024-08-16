import { useParams } from "react-router-dom";

const Restaurant = () => {
  const { id } = useParams();

  console.log(id);
  return <div>{id}</div>;
};

export default Restaurant;
