import classes from "./FilterList.module.css";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "react-bootstrap/Pagination";
import Product from "../product-related/Product";
import useFetch from "../hook/useFetch";
import Media from "react-media";
const FilterList = (props) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("Default sorting");

  const { data, loading, error, reFetch } = useFetch(
    `${props.api}&page=${page - 1}`
  );

  const changePage = (option) => {
    if (option === "-") setPage((pre) => pre - 1);
    else setPage((pre) => pre + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setSort = (e) => {
    let value = e.target.value;
    if (value === "a") setFilter("A - Z");
    if (value === "z") setFilter("Z - A");
    if (value === "highest") setFilter("From highest");
    if (value === "smallest") setFilter("From smallest");

    dispatch({ type: "SORT", sort: value });
  };

  const checkPrevPage = () => {
    if (page > 1) return true;
    else return false;
  };

  const checkNextPage = () => {
    if (data.length !== 0 && data.length < 9) return false;
    else if (data.length === 9) return true;
  };

  useEffect(() => {
    setPage(1);
  }, [props.api]);
  return (
    <React.Fragment>
      {data && (
        <div className={classes.container}>
          <div className={classes.search}>
            <Media
              queries={{
                normal: "(min-width: 481px)",
                small: "(max-width: 480px)",
              }}
            >
              {(matches) => (
                <React.Fragment>
                  {matches.normal && <div></div>}
                  {matches.small && (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="secondary"
                        id="dropdown-basic"
                        onClick={props.openFilter}
                      >
                        Open Filter
                      </Dropdown.Toggle>
                    </Dropdown>
                  )}
                </React.Fragment>
              )}
            </Media>

            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {filter}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as="button" value="a" onClick={setSort}>
                  A - Z
                </Dropdown.Item>
                <Dropdown.Item as="button" value="z" onClick={setSort}>
                  Z - A
                </Dropdown.Item>
                <Dropdown.Item as="button" value="highest" onClick={setSort}>
                  From highest
                </Dropdown.Item>
                <Dropdown.Item as="button" value="smallest" onClick={setSort}>
                  From smallest
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <ul className={classes.list}>
            {loading && "Loading page ..."}
            {data?.length === 0 && "No more product!"}
            {!loading &&
              data?.map((product, index) => {
                return (
                  <li key={index}>
                    <Product product={product} />
                  </li>
                );
              })}
          </ul>
          <div className={classes.page}>
            <Pagination>
              {checkPrevPage() && (
                <Pagination.Prev onClick={() => changePage("-")} />
              )}
              <Pagination.Item>{page}</Pagination.Item>
              {checkNextPage() && (
                <Pagination.Next onClick={() => changePage("+")} />
              )}
            </Pagination>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default FilterList;
