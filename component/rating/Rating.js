import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import "./Rating.css";
import useFetch from "../hook/useFetch";
import { api } from "../../api/api";
import Pagination from "react-bootstrap/Pagination";
import axios from "axios";
import { formatDate } from "../../store/convert";
import Cookies from "js-cookie";
const Rating = (props) => {
  const token = Cookies.get("token");
  const email = Cookies.get("email");
  const [star, setStar] = useState(0);
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState("");
  const { data, loading, error, reFetch } = useFetch(
    `${api}/public/products/review?productId=${props.id}&page=${page}`
  );

  useEffect(() => {
    reFetch();
  }, [props.id, page]);

  let disable = true;
  if (star !== 0 || comment !== "") disable = false;
  else disable = true;

  const onChange = (nextValue) => {
    setStar(nextValue);
  };

  const checkPrevPage = () => {
    if (page > 1) return true;
    else return false;
  };

  const checkNextPage = () => {
    if (data.length !== 0 && data.length < 5) return false;
    else if (data.length === 5) return true;
  };

  const changePage = (option) => {
    if (option === "-") setPage((pre) => pre - 1);
    else setPage((pre) => pre + 1);
  };

  const createComment = async (e) => {
    e.preventDefault();
    const fomrData = new FormData();
    fomrData.append("productId", props.id);
    fomrData.append("email", email);
    fomrData.append("rating", star);
    fomrData.append("comment", comment);

    try {
      let res = await axios.post(`${api}/users/comment`, fomrData, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res) {
        reFetch();
        setStar(0);
        setComment("");
      }
    } catch (err) {
      alert("Something wrong!");
    }
  };

  return (
    <React.Fragment>
      {token && (
        <div>
          <StarRatings
            rating={star}
            starRatedColor="blue"
            changeRating={onChange}
            numberOfStars={5}
            name="rating"
            starDimension="30px"
          />

          <form className="comment_form" onSubmit={createComment}>
            <textarea
              placeholder="Comment here"
              className="input_comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" disabled={disable}>
              Add review
            </button>
          </form>
        </div>
      )}

      {!token && <div>Login to comment</div>}

      {data?.map((comment, index) => {
        return (
          <div key={index} className="comment">
            <div className="comment_info">
              <div>
                <div className="email">{comment.email}</div>

                <StarRatings
                  rating={comment.rating}
                  starRatedColor="blue"
                  numberOfStars={5}
                  name="rating"
                  starDimension="15px"
                />
              </div>
              <div className="day">{formatDate(comment.day)}</div>
            </div>

            <div className="email">{comment.comment}</div>
          </div>
        );
      })}
      <div className="pageComment">
        <div></div>
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
    </React.Fragment>
  );
};

export default Rating;
