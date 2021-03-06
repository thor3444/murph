import {
  faCalendarAlt,
  faUser,
  faHourglassStart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../components/Container";
import { Loading } from "../components/Loading";
import AuthContext from "../context/auth/authContext";
import { formatDate, msToTime } from "../util/format";

const ProfileStyles = styled.div`
  display: flex;
  flex: 1;

  & > div {
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 2rem;
  }

  @media (min-width: 60em) {
    & > div {
      grid-template-columns: 1fr 3fr;
    }
  }

  & h1 {
    text-align: center;
    color: #a0aec0;
    font-weight: bold;
    font-size: 2rem;
  }
`;

const Col = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  align-self: flex-start;
  margin-top: 1.5rem;
`;

const User = styled.div`
  background-color: #2d3748;
  padding: 0.8rem 1rem;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 1rem;

  & svg {
    margin: 1rem 0;
  }

  & h3 {
    color: #fff;
    font-size: 1.7rem;
    text-align: center;
    font-weight: normal;
    margin: 0;

    & span {
      color: #a0aec0;
      font-weight: normal;
      font-size: 1.4rem;
    }
  }

  & h4 {
    color: #a0aec0;
    font-size: 1rem;
    text-align: center;
    font-weight: normal;
    margin: 0;
    display: flex;
    align-items: center;

    & svg {
      margin-right: 0.5rem;
    }
  }
`;

const Backdrop = styled.div`
  margin: 1rem 0;
  background-color: #a0aec0;
  border-radius: 100%;
  padding: 3rem;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Table = styled.table`
  margin: auto;
  border-collapse: collapse;

  & tr th:nth-child(1),
  & tr th:nth-child(2),
  & tr th:nth-child(3),
  & tr td:nth-child(1),
  & tr td:nth-child(2),
  & tr td:nth-child(3) {
    display: none;
  }

  @media (min-width: 36em) {
    & tr th:nth-child(1),
    & tr th:nth-child(2),
    & tr th:nth-child(3),
    & tr td:nth-child(1),
    & tr td:nth-child(2),
    & tr td:nth-child(3) {
      display: table-cell;
    }
  }

  & > thead {
    color: #63b3ed;
  }

  & th {
    border-bottom: 0.1rem solid #4a5568;
    padding: 0.8rem 1rem;
  }

  & td {
    border-bottom: 0.1rem solid #4a5568;
    border-right: 0.1rem solid #4a5568;
    padding: 0.8rem 1rem;
    color: #a0aec0;

    &:last-child {
      border-right: 0;
    }

    &:first-child,
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      text-align: center;
    }
  }

  & tbody {
    & tr {
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: #4a5568;
      }
    }

    & tr:last-child td {
      border-bottom: 0;
    }
  }
`;

const BeginButton = styled.div`
  margin: 1rem auto;
  & a {
    color: #63b3ed;
    transition: all 0.2s;
    border: 0.1rem solid #63b3ed;
    border-radius: 5rem;
    text-decoration: none;
    padding: 1rem 1.2rem;
    font-size: 1.1rem;

    &:focus {
      outline: 0;
      box-shadow: 0 0 0 0.2rem #63b3ed;
    }

    &:hover {
      color: #1a202c;
      background-color: #63b3ed;
    }
  }
`;

export const Profile = ({ history }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [usersMurphs, setUsersMurphs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function getUsersMurphs() {
      try {
        if (user) {
          const res = await axios.get("/api/auth/");

          if (mounted) {
            setUsersMurphs(res.data.murphs);
            setLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (!isAuthenticated) {
      history.push("/signin");
    } else {
      getUsersMurphs();
    }

    return () => (mounted = false);
  }, [isAuthenticated, history, user]);

  return (
    <ProfileStyles>
      <Container>
        <Col>
          <User>
            <Backdrop>
              <FontAwesomeIcon icon={faUser} size="6x" color="#4a5568" />
            </Backdrop>
            <h3>
              {user && user.fname} <span>{user && user.lname}</span>
            </h3>
            <h4>
              <FontAwesomeIcon icon={faCalendarAlt} color="#a0aec0" />{" "}
              {user && new Date(user.date).toDateString()}
            </h4>
          </User>
          <BeginButton>
            <Link to="/workout">
              <FontAwesomeIcon icon={faHourglassStart} /> Begin Workout
            </Link>
          </BeginButton>
        </Col>

        <div>
          <h1>My Murphs</h1>
          {loading ? (
            <Loading />
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>1st Mile Time</th>
                  <th>Calisthenics Time</th>
                  <th>2nd Mile Time</th>
                  <th>Total Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {usersMurphs.map((murph) => {
                  return (
                    <tr
                      key={murph._id}
                      onClick={() => history.push(`/murph/${murph._id}`)}
                    >
                      <td>{msToTime(murph.mileOneTime)}</td>
                      <td>{msToTime(murph.calisthenicsTime)}</td>
                      <td>{msToTime(murph.mileTwoTime)}</td>
                      <td>{msToTime(murph.totalTime)}</td>
                      <td>{formatDate(murph.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </div>
      </Container>
    </ProfileStyles>
  );
};
