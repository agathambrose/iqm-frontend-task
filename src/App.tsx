import { useState } from "react";
import { useQuery } from "react-query";
import Header from "./components/Header";
import { LinearProgress, Modal, Backdrop, Fade } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Dummydata } from "./DummyData";
//types
type ItemType = {
  owner: {
    user_id: number;
    display_name: string;
  };
  title: string;
  question_id: number;
  creation_date: number;
  link: string;
  key: string;
};

type DataType = {
  items: ItemType[];
};

let url = "https://api.stackexchange.com/2.2/search";
const getData = async (): Promise<DataType> => await (await fetch(url)).json();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
    },
  })
);

const App = () => {
  const { data, isLoading, error } = useQuery<DataType>("data", getData);
  console.log("data", data);

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="mx-2 my-3 md:mx-10">
      <Header />

      {error ? (
        <div className="mt-10 text-2xl text-center font-poppins">
          Oops! Something went wrong...
        </div>
      ) : (
        ""
      )}
      {isLoading ? (
        <LinearProgress color="secondary" />
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center w-full font-poppins">
          {Dummydata.map(({ id, title, owner, creation_date, link }) => {
            return (
              <div className="m-3 border border-gray-100 rounded shadow-md lg:w-1/5 sm:w-1/3">
                <div className="leading-8" key={id}>
                  <h2 className="px-4 py-1 text-2xl font-bold text-gray-900 md:text-xl">
                    {owner}
                  </h2>
                  <p className="px-4 text-xl truncate md:text-lg">{title}</p>
                  <p className="px-4 py-1 text-sm">{creation_date}</p>
                  <button
                    type="button"
                    className="w-3/5 py-3 mt-2 text-white bg-red-400 rounded-r-full outline-none md:py-2 font-poppins hover:bg-yellow-400 focus:outline-none"
                    onClick={handleOpen}
                  >
                    More
                  </button>
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
                          id="transition-modal-title"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
