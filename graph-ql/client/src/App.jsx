import { gql, useQuery } from "@apollo/client";
import "./App.css";

const query = gql`
  query getTodos {
    getAllUsers {
      name
      email
    }
  }
`;

function App() {
  const { data } = useQuery(query);
  return (
    <main>
      <h1 style={{ textAlign: "center", padding: 10 }}>Users Table</h1>
      <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: 10 }}>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data?.getAllUsers.map((user, index) => (
            <tr
              key={user.name}
              style={{
                textAlign: "center",
                backgroundColor: (index + 1) % 2 === 0 ? "lightgray" : "white",
              }}
            >
              <td style={{ padding: 10 }}>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;