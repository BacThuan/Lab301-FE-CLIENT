import Banner from "../../component/banner/Banner";
import Filter from "../../component/filter-category/Filter";
import FilterList from "../../component/filter-category/FilterList";
import classes from "./ShopPage.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../api/api";
import Media from "react-media";
const ShopPage = () => {
  let filter = useSelector((state) => state.filter);
  let sort = useSelector((state) => state.sort);
  let searching = useSelector((state) => state.searching);
  const [openFilter, setOpenFilter] = useState(false);
  const [apiData, setApiData] = useState(`${api}/public/products?public=true`);

  const refreshApi = (sort, brand, category, color, price, searching) => {
    setApiData(
      `${api}/public/products?public=true&sort=${sort}&brand=${brand}&category=${category}&color=${color}&price=${price}&product=${searching}`
    );
  };
  useEffect(() => {
    document.title = "Shop Page";

    refreshApi(
      sort,
      filter.brand,
      filter.category,
      filter.color,
      filter.price,
      searching
    );
  }, [filter, sort, searching]);

  return (
    <div>
      <Banner title={"Shop"} />
      <div className={classes.filter}>
        <Media
          queries={{
            normal: "(min-width: 481px)",
            small: "(max-width: 480px)",
          }}
        >
          {(matches) => (
            <React.Fragment>
              {matches.normal && <Filter />}
              {matches.small && (
                <div
                  className={
                    openFilter ? classes.openFilter : classes.hideFilter
                  }
                >
                  <Filter />
                </div>
              )}
            </React.Fragment>
          )}
        </Media>
        <FilterList
          api={apiData}
          openFilter={() => setOpenFilter(!openFilter)}
        />
      </div>
    </div>
  );
};
export default ShopPage;
