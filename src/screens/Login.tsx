import { FormEvent, useState, useEffect } from "react";
import { Grid, makeStyles, TextField, Button } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations";
import { Redirect } from "react-router-dom";

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
  preloader_container: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  preloader: {
    boxSizing: "border-box",
    position: "relative",
    width: 20,
    height: 20,
    border: "4px solid #FFFFFF",
    borderRadius: "50%",
    animation: "$rotate 1000ms infinite linear",

    "&:before": {
      content: '""',
      position: "absolute",
      backgroundColor: "#3f51b5",
      width: 4,
      height: 4,
      top: "-3px",
      left: 0,
      borderRadius: "50%",
    },
  },
  "@keyframes rotate": {
    from: { transform: "rotate(-360deg)" },
    to: { transform: "rotate(360deg)" },
  },
  button: {
    position: "relative",
    minWidth: 200,
    borderRadius: 32,
    textTransform: "initial",
    fontWeight: 600,
  },
  error: {
    marginTop: 16,
    color: "#f44336",
    fontSize: 16,
    fontWeight: 500,
  },
});

const Login = () => {
  const classes = useStyles();

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passError, setPassError] = useState<boolean>(false);
  const [apiError, setApiError] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // redirect to account page if user already logged
    setRedirect(!!localStorage.getItem("jwt-token"));
  }, [])

  const [login] = useMutation(LOGIN_USER);

  const authUser = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(false);
    setLoading(true);

    if (!isValidated()) {
      setLoading(false);
      return;
    }

    try {
      const {
        data: {
          login: { jwt },
        },
      } = await login({ variables: { email, password } });

      if (jwt) {
        setLoading(false);
        // save token to localStorage
        // in order to get user data with Authorization header.
        localStorage.setItem("jwt-token", jwt);
        // redirect to account page.
        setRedirect(true);
      }
    } catch (error) {
      setLoading(false);
      setApiError(true);
    }
  };

  const isValidated = () => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const isEmailValidated =
      !!email && emailRegex.test(String(email).toLowerCase());
    const isPasswordValidated = !!password;

    setEmailError(!isEmailValidated);
    setPassError(!isPasswordValidated);

    return isEmailValidated && isPasswordValidated;
  };

  return (
    <>
      {redirect && <Redirect to="/account" />}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className={classes.root}
      >
        <form className={classes.form} autoComplete="off" onSubmit={authUser}>
          <Grid
            container
            item
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              id="standard-error-helper-text"
              className={classes.field}
              value={email}
              onChange={(e) => {
                setEmailError(false);
                setEmail(e.target.value);
              }}
              error={emailError}
              type="email"
              label="Email"
              autoComplete="off"
              helperText={`${
                emailError ? "Incorrect value, example: name@domain.com" : ""
              }`}
            />
            <TextField
              id="standard-error-helper-text"
              className={classes.field}
              error={passError}
              value={password}
              onChange={(e) => {
                setPassError(false);
                setPassword(e.target.value);
              }}
              type="password"
              label="Password"
              autoComplete="off"
              helperText={`${passError ? "Password is required!" : ""}`}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => null}
              className={classes.button}
              type="submit"
            >
              {loading && (
                <div className={classes.preloader_container}>
                  <div className={classes.preloader}></div>
                </div>
              )}
              Login
            </Button>
            {apiError && (
              <p className={classes.error}>
                {/* since API error returning message: "Bad Request" - decided to use more friendly message */}
                User not found, please try another credentials.
              </p>
            )}
          </Grid>
        </form>
      </Grid>
    </>
  );
};

export default Login;
