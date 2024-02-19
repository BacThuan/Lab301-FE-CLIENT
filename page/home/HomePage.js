import BannerHome from "../../component/banner/BannerHome";
import Category from "../../component/category/Category";
import ListProduct from "../../component/list-product/ListProduct";
import Subscribe from "../../component/subscribe/Subscribe";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
const HomePage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "Home Page";
    dispatch({ type: "HIDE_POPUP" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div>
      <BannerHome />
      <Category />
      <ListProduct />
      <Subscribe />
    </div>
  );
};
export default HomePage;
