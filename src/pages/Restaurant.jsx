import { useParams } from "react-router-dom";
import { restaurant_data } from "../mockdata";

const Restaurant = () => {
  const { id } = useParams();

  console.log(restaurant_data)
  return <div>
 
    <p>{id}</p>
  </div>;
};

export default Restaurant;
