"use client";

import { useEffect, useState } from "react";

export default function PokePage() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(200);

  const [pokemon, setPokemon] = useState(null);
  const [type, setType] = useState("");

  const [isListLoading, setIsListLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const limit = 10;

  useEffect(() => {
    fetchList();
  }, [page]);

  const fetchList = async () => {
    setIsListLoading(true);
    setErrMsg("");

    try {
      const offset = (page - 1) * limit;

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) throw new Error();

      const data = await response.json();

      setList(data.results);
      setCount(200);
    } catch {
      setErrMsg("Failed to fetch Pokémon list");
    } finally {
      setIsListLoading(false);
    }
  };

  const fetchDetails = async (url) => {
    setIsDetailLoading(true);
    setErrMsg("");

    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error();

      const data = await response.json();

      setPokemon(data);
      setType(data.types?.[0]?.type?.name || "");
    } catch {
      setErrMsg("Failed to fetch Pokémon details");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const pages = Math.ceil(count / limit);

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "20px",
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: "100vh",
      }}
    >
      {/* LEFT PANEL */}
      <div>
        <h2 style={{ color: "#000000", marginBottom: "10px" }}>
          Pokémon Table
        </h2>

        {isListLoading ? (
          <p>Loading...</p>
        ) : errMsg ? (
          <p style={{ color: "red" }}>{errMsg}</p>
        ) : (
          <>
            <table
              style={{
                borderCollapse: "collapse",
                backgroundColor: "#ffffff",
                color: "#000000",
                width: "500px",
                tableLayout: "fixed",
                border: "1px solid #000",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: "100px",
                      textAlign: "center",
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    Sr. No.
                  </th>

                  <th
                    style={{
                      width: "400px",
                      textAlign: "left",
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    Poke Name
                  </th>
                </tr>
              </thead>

              <tbody>
                {list.map((p, idx) => (
                  <tr key={p.name}>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        border: "1px solid #000",
                        padding: "8px",
                      }}
                    >
                      {(page - 1) * limit + idx + 1}
                    </td>

                    <td
                      style={{
                        color: "#000000",
                        cursor: "pointer",
                        textTransform: "capitalize",
                        paddingLeft: "15px",
                        border: "1px solid #000",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      }}
                      onClick={() => fetchDetails(p.url)}
                    >
                      {p.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "10px",
                color: "#000000",
                width: "500px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Total: 200</span>

              <div>
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  style={{ color: "#000000" }}
                >
                  Prev
                </button>

                <span style={{ margin: "0 10px" }}>{page}</span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === pages}
                  style={{ color: "#000000" }}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          minWidth: "260px",
          border: "1px solid #000",
          padding: "15px",
          backgroundColor: "#ffffff",
          color: "#000000",
        }}
      >
        <h2 style={{ color: "#000000" }}>
          Pokémon Types {pokemon ? `(${pokemon.name})` : ""}
        </h2>

        {isDetailLoading ? (
          <p>Loading...</p>
        ) : !pokemon ? (
          <p>Select a Pokémon</p>
        ) : (
          <>
            <div style={{ marginBottom: "10px" }}>
              {pokemon.types.map((t) => (
                <button
                  key={t.type.name}
                  onClick={() => setType(t.type.name)}
                  style={{
                    marginRight: "6px",
                    padding: "5px 10px",
                    border: "1px solid #aaa",
                    background:
                      type === t.type.name ? "#ccc" : "#fff",
                    color: "#000000",
                  }}
                >
                  {t.type.name}
                </button>
              ))}
            </div>

            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "1px solid #000",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    Game Indices
                  </td>

                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    {pokemon.game_indices.length}
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    Moves
                  </td>

                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                    }}
                  >
                    {pokemon.moves.length}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
          
        )}
      </div>
    </div>
  );
}