import { useEffect, useState } from "react";
// import { useQuery } from "react-query";
import Header from "./components/Header";
import { LinearProgress, Modal, Backdrop, Fade } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { setTimeout } from "timers";
import axios from "axios";
//types
type ItemType = {
  owner: {
    user_id: string | undefined;
    display_name: string;
  };
  title: string;
  question_id: number | string;
  creation_date: number;
  link: string;
  body: string;
  key: number | string;
};

// type DataType = {
//   items: ItemType[];
//   page: number;
//   page_size: number;
//   has_more: boolean;
// };

//customize modal
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #fefefe",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
    },
  })
);

const App = () => {
  //define and initialize state
  const classes = useStyles();
  const [data, setData] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [page_size, setPageSize] = useState(30);
  const [page, setPage] = useState(1);
  const [has_more, setHasMore] = useState(true);

  //infinite scroll logic

  const fetchMoreData = async () => {
    let url = `https://api.stackexchange.com/2.2/questions?page=${page}&page_size=${page_size}&unsafe=false&filter=!-t4wShp3p(Y1d*tlmyv*XT4ew8M02DUQ5X1AkBWTL70s4IVmUHjSbAR.Gf&site=stackoverflow`;

    const getMoreData = async () => {
      try {
        const res = await axios.get(url);
        const { data } = res;
        const newData = data;
        let totalData = [...data.items, ...newData.items];
        data.items = totalData;
        setData(data);
      } catch (error) {
        console.log({ ...error });
        if (error) {
          <h4 className="font-medium text-center font-poppins">
            Oops! Something went wrong..
          </h4>;
        }
      }
    };
    await getMoreData();

    if (page >= 1) {
      setPage(page + 1);
      setHasMore(has_more);
    }
    

    if (page_size >= 300) {
      setHasMore(false);
    }
    console.log("Hello");
    console.log("hasmore", has_more);
    console.log("page", page);
    console.log("pagesize", page_size);
    console.log("datalength", data.items?.length);
  };

  useEffect(() => {
    fetchMoreData();
  }, []);

  //set timeout logic
  setTimeout(() => {
    setPageSize(30);
    if (page_size > 30) {
      setHasMore(true);
      return;
    }
  }, 300);

  //modal open
  const handleOpen = (title: string, link: string, body: string) => {
    setOpen(true);
    setLink(link);
    setTitle(title);
    setBody(body);
  };

  //modal close
  const handleClose = () => {
    setOpen(false);
  };

  //body from string to html element
  // var htmlString = body;
  // var questionBody = new DOMParser().parseFromString(htmlString, "text/xml");
  // var bodyPost = questionBody.firstElementChild;
  // // console.log(bodyPost);

  return (
    <div className="flex flex-col justify-center w-screen my-3 md:w-full">
      <Header />
      <InfiniteScroll
        dataLength={data.items !== undefined ? data.items.length : 0}
        next={fetchMoreData}
        hasMore={has_more}
        loader={<LinearProgress color="secondary" />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="flex flex-col flex-wrap items-center w-screen md:justify-center md:flex-row md:-mx-8 font-poppins">
          {data.items?.map(
            ({ key, title, owner, creation_date, link, body }: ItemType) => {
              var dateCreated = new Date(
                creation_date * 1000
              ).toLocaleDateString("us-EN");

              return (
                <div className="w-4/5 m-3 border border-gray-100 rounded shadow-md lg:w-1/5">
                  <div className="leading-8" key={key}>
                    <h2
                      className="px-4 py-1 text-2xl font-medium text-gray-900 truncate md:text-xl"
                      id={owner.user_id}
                    >
                      <span className="font-bold">Author:</span>{" "}
                      {owner.display_name}
                    </h2>
                    <p className="px-4 text-xl truncate md:text-lg" id="title">
                      {title}
                    </p>
                    <p className="px-4 py-1 text-sm">{dateCreated}</p>
                    <button
                      type="button"
                      className="w-3/5 py-3 mt-2 text-white bg-red-400 rounded-r-full outline-none md:py-2 font-poppins hover:bg-yellow-400 focus:outline-none"
                      onClick={() => handleOpen(title, link, body)}
                    >
                      More
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
        {/* )} */}
      </InfiniteScroll>

      {}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="flex items-center justify-center w-10/12 h-full mx-auto md:w-4/12"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2
              id="transition-modal-title"
              className="my-4 text-xl font-medium font-poppins"
            >
              {title}
            </h2>
            {/* <div className="text-xs">{body}</div> */}
            <a
              href={link}
              rel="noreferrer"
              target="_blank"
              id="transition-modal-description"
            >
              <button
                type="button"
                className="w-full py-2 my-2 text-black bg-red-400 rounded outline-none hover:opacity-90 focus:outline-none font-poppins"
              >
                Go to post
              </button>
            </a>

            <button
              type="button"
              className="w-full py-2 my-2 text-black transition bg-green-400 rounded outline-none delay-50 hover:opacity-90 focus:outline-none font-poppins"
              onClick={handleClose}
            >
              Close Modal
            </button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default App;
