"use client";

import { useEffect, useState } from "react";

export default function PokemonPage() {
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const offset = (page - 1) * limit;

      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      const data = await res.json();

      setPokemon(data.results);

      // ✅ TOTAL LIMIT 200
      setTotal(Math.min(data.count, 200));

      if (data.results.length > 0) {
        fetchPokemonDetails(data.results[1]?.url || data.results[0].url);
      }
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };

  const fetchPokemonDetails = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          gap: "25px",
        }}
      >
        {/* LEFT SIDE TABLE */}
        <div style={{ width: "55%" }}>
          <h1
            style={{
              fontSize: "28px",
              marginBottom: "15px",
              fontWeight: "700",
              color: "#1e293b",
            }}
          >
            Pokémon Table
          </h1>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #cfcfcf",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Sr. No.</th>
                <th style={thStyle}>Poke Name</th>
              </tr>
            </thead>

            <tbody>
              {pokemon.map((item, index) => (
                <tr
                  key={item.name}
                  onClick={() => fetchPokemonDetails(item.url)}
                  style={{ cursor: "pointer" }}
                >
                  <td style={tdStyle}>
                    {(page - 1) * limit + index + 1}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "600",
                      fontSize: "18px",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.name}
                  </td>
                </tr>
              ))}

              {/* Empty Rows */}
              {[...Array(5)].map((_, i) => (
                <tr key={i + "empty"}>
                  <td style={{ ...tdStyle, height: "35px" }}></td>
                  <td style={tdStyle}></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "16px",
            }}
          >
            <span>Total: {total}</span>

            <div>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={btnStyle}
              >
                Prev.
              </button>

              <span style={{ margin: "0 10px" }}>{page}</span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={btnStyle}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div
          style={{
            width: "45%",
            borderLeft: "1px solid #d8d8d8",
            paddingLeft: "25px",
          }}
        >
          {selectedPokemon && (
            <>
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: "700",
                  marginBottom: "15px",
                  textTransform: "capitalize",
                  color: "#1e293b",
                }}
              >
                Pokémon Types ({selectedPokemon.name})
              </h1>

              <div
                style={{
                  display: "flex",
                  marginBottom: "15px",
                  gap: "8px",
                }}
              >
                {selectedPokemon.types.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#e5e5e5",
                      padding: "6px 16px",
                      fontSize: "14px",
                      minWidth: "80px",
                      textAlign: "center",
                    }}
                  >
                    {item.type.name}
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: "1px solid #999",
                  width: "70%",
                  marginBottom: "15px",
                }}
              ></div>

              <p style={infoText}>
                Game Indices: {selectedPokemon.game_indices.length}
              </p>

              <p style={infoText}>
                Moves: {selectedPokemon.moves.length}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid #cfcfcf",
  padding: "8px",
  fontSize: "14px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #cfcfcf",
  padding: "8px",
  fontSize: "14px",
};

const btnStyle = {
  padding: "4px 8px",
  border: "none",
  background: "transparent",
  fontSize: "14px",
  cursor: "pointer",
};

const infoText = {
  fontSize: "16px",
  marginBottom: "10px",
};