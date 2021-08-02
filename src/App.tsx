import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";
import Login from "./screens/Login";
import Account from "./screens/Account";

const AuthRoute = (props: RouteProps) => {
  const { children, ...rest } = props;
  const isUserLogged = !!localStorage.getItem("jwt-token");

  return (
    <Route
      {...rest}
      render={() =>
        isUserLogged ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
};

function App() {
  return (
    <Router>
      <Switch>
        <AuthRoute exact path="/">
          <Account />
        </AuthRoute>
        <Route path="/login">
          <Login />
        </Route>
        <AuthRoute path="/account">
          <Account />
        </AuthRoute>
      </Switch>
    </Router>
  );
}

export default App;
