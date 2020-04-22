import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Store";

export const Profile = ({ history }) => {
  const { state } = useContext(AuthContext);
  const { isAuthenticated } = state;

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/signin");
    }
  }, [isAuthenticated, history]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 mx-2">
      <div className="bg-gray-800 py-4 px-8 mb-6 shadow rounded-lg flex flex-col items-center max-w-xs w-full box-border">
        <h3 className="text-xl font-medium text-gray-100 max-w-xs text-center mb-2">
          Welcome {state.user && state.user.fname}{" "}
          {state.user && state.user.lname}
        </h3>
      </div>
      <Link
        to="/workout"
        className="bg-blue-400 shadow rounded-full py-4 px-6 text-lg hover:underline text-gray-900"
      >
        Begin Workout
      </Link>
    </div>
  );
};
