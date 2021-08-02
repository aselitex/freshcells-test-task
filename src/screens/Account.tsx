import { useState } from "react";
import { Grid, makeStyles, TextField, Button } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";
import { GET_USER_INFO } from "../graphql/queries";

const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#8EC5FC",
    backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
  },
  form: {
    minWidth: 360,
    background: "#FFFFFF",
    borderRadius: "5px",
    padding: "32px",
    boxSizing: "border-box",
    boxShadow: "0px 4px 41px 0px #686566",
  },
  field: {
    width: "100%",
    margin: "16px 0",

    "&:first-child": {
      marginTop: 0,
    },
  },
  button: {
    minWidth: 200,
    borderRadius: 32,
    textTransform: "initial",
    fontWeight: 600,
  }
});

const Account = () => {
  const classes = useStyles();
  const [redirect, setRedirect] = useState<boolean>(false);

  const { loading, error, data } = useQuery(GET_USER_INFO);

  return (
    <>
      {redirect && <Redirect to="/login" />}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className={classes.root}
      >
        <form className={classes.form} autoComplete="off">
          {loading && <div>Loading user data..</div>}
          {error && <div>{error.message}</div>}
          {data && (
            <Grid
              container
              item
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <TextField
                className={classes.field}
                type="text"
                label="First Name"
                autoComplete="off"
                value={data.user.firstName}
                disabled
              />
              <TextField
                className={classes.field}
                type="text"
                label="Last Name"
                autoComplete="off"
                value={data.user.lastName}
                disabled
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  localStorage.clear();
                  setRedirect(true);
                }}
                className={classes.button}
              >
                Logout
              </Button>
            </Grid>
          )}
        </form>
      </Grid>
    </>
  );
};

export default Account;
