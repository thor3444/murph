import axios from "axios";
import React, { useReducer } from "react";
import setAuthToken from "../../util/setAuthToken";
import AuthContext from "./authContext";
import authReducer from "./authReducer";

export const AuthState = ({ children }) => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    setAuthToken(localStorage.token);

    try {
      const res = await axios.get("/api/auth");

      dispatch({
        type: "USER_LOADED",
        payload: res.data,
      });
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  const login = async (user) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/auth", user, config);

      dispatch({
        type: "LOGIN",
        payload: res.data,
      });

      loadUser();
    } catch (error) {
      dispatch({ type: "AUTH_ERROR" });
    }
  };

  const register = async (newUser) => {
    const { fname, lname, email, password } = newUser;

    try {
      let res = await fetch("/api/users", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          lname,
          email,
          password,
        }),
      });

      let data = await res.json();

      if (res.ok) {
        dispatch({
          type: "LOGIN",
          payload: data,
        });
      } else {
        throw data;
      }
    } catch (error) {
      console.log(error);
      // Dispatch error
    }
  };

  const logout = async () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        loadUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
