import { useState } from "react";
import { useQuery } from "react-query";
import Header from "./components/Header";
import { LinearProgress, Modal, Backdrop, Fade } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
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
  key: number | string;
};

type DataType = {
  items: ItemType[];
  quota_max: number;
  quota_remaining: number;
};

//customize modal
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "auto",
      width: "40vw",
    },
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
  //fetch data
  let url =
    "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&site=stackoverflow";
  const getData = async (): Promise<DataType> =>
    await (await fetch(url)).json();

  const { data, isLoading, error } = useQuery<DataType>("data", getData);
  console.log("data", data);

  // destructure data to get pages
  // const stackData = {
  //   pages: [{ data }],
  //   pageParams: [null],
  // };

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");

  const handleOpen = (title: string, link: string) => {
    setOpen(true);
    setLink(link);
    setTitle(title);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col justify-center w-screen mx-2 my-3 md:w-11/12">
      <Header />

      {!error ? (
        ""
      ) : (
        <div className="flex justify-center mt-10 text-2xl font-poppins">
          Oops! Something went wrong...
        </div>
      )}
      {isLoading && !error ? (
        <LinearProgress color="secondary" />
      ) : (
        <div className="flex flex-col flex-wrap items-center w-screen md:justify-center md:flex-row md:-mx-8 font-poppins">
          {data?.items.map(({ key, title, owner, creation_date, link }) => {
            var dateCreated = new Date(creation_date * 1000).toLocaleDateString(
              "us-EN"
            );

            return (
              <div className="w-4/5 m-3 border border-gray-100 rounded shadow-md lg:w-1/5 ">
                <div className="leading-8" key={key}>
                  <h2
                    className="px-4 py-1 text-2xl font-bold text-gray-900 truncate md:text-xl"
                    id={owner.user_id}
                  >
                    {owner.display_name}
                  </h2>
                  <p className="px-4 text-xl truncate md:text-lg" id="title">
                    {title}
                  </p>
                  <p className="px-4 py-1 text-sm">{dateCreated}</p>
                  <button
                    type="button"
                    className="w-3/5 py-3 mt-2 text-white bg-red-400 rounded-r-full outline-none md:py-2 font-poppins hover:bg-yellow-400 focus:outline-none"
                    onClick={() => handleOpen(title, link)}
                  >
                    More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
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
              id="transition-modal-title title"
              className="my-4 text-xl font-medium font-poppins"
            >
              {title}
            </h2>
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
