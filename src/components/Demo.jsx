import { useState, useEffect } from "react";
import { linkIcon, loader, copy, tick } from "../assets";
import { AiOutlineEnter } from "react-icons/ai";
import { useLazyGetSummaryQuery } from "../services/article";
import { RxCross2 } from "react-icons/rx";
const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });
    console.log(data);
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedallArticle = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updatedallArticle);
      console.log(newArticle);
      localStorage.setItem("articles", JSON.stringify(updatedallArticle));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const handleDelete = (index) => {
    const updatedAllArticles = [...allArticles];
    updatedAllArticles.splice(index, 1);
    setAllArticles(updatedAllArticles);
    localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
   
  };

  return (
    <section className="mt-16 w-full max-w-xl ">
      {/* ?search */}
      <div className="flex flex-col w-full gap-2">
        <form
          action=""
          className="flex justify-center items-center relative "
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="lnk_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL "
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
            onKeyDown={handleKeyDown}
          />

          <button
            type="submit"
            className="submit_btn text-black 
         peer-focus:border-gray-700 peer-focus:text-gray-700 text-3xl"
          >
            <AiOutlineEnter size={22} />
          </button>
        </form>

        {/* browser history */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.reverse().map((item, index) => {
            return (
              <div
                key={`link-${index}`}
                onClick={() => {
                  setArticle(item);
                }}
                className="link_card"
              >
                <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                  <img
                    src={copied === item.url ? tick : copy}
                    alt={copied === item.url ? "tick_icon" : "copy_icon"}
                    className="w-[40%] h-[40%] object-contain"
                  />
                </div>
                <p className="flex-1 font-satoshi text-blue-500 font-medium text-sm truncate">
                  {item.url}
                </p>
                <RxCross2
                  className=" text-gray-400"
                  onClick={() => {
                    handleDelete(index);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Display results */}
      <div className="my-10 nax-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            <br />
            <span className="font-santoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-santoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                {" "}
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
