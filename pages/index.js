import Head from "next/head";
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [match, setMatch] = useState({
    playerAId: "",
    playerBId: "",
    scoreA: 0,
    scoreB: 0,
  });
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/api/player")
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
      });
  }, []);

  useEffect(() => {
    fetch("/api/match")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMatches(data);
      });
  }, []);

  function refresh() {
    fetch("/api/player")
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
      });

    fetch("/api/match")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMatches(data);
      });
  }

  function handleInsertPlayer() {
    if (!playerName.trim()) return;

    fetch("/api/player", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: playerName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data);
        setPlayerName("");
      })
      .catch((error) => console.error("Error:", error));
  }

  function handleMatchChange(event) {
    const { name, value } = event.target;
    setMatch((prevMatch) => ({
      ...prevMatch,
      [name]: value,
    }));
  }

  function handleInsertMatch() {
    fetch("/api/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(match),
    })
      .then((response) => response.json())
      .then((data) => {
        setMatch({
          playerAId: "",
          playerBId: "",
          scoreA: 0,
          scoreB: 0,
        });
        refresh();
      })
      .catch((error) => console.error("Error:", error));
  }

  return (
    <div className="container">
      <Head>
        <title>Table Tennis Ranking</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <h1>Ranking</h1>
          {/* List of players */}
          {players?.map((player) => (
            <div key={player._id}>
              <p>
                {player.name}: ({player.wins}/{player.losses}){" "}
                {Math.round(player.rating)}
              </p>
            </div>
          ))}
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              {/* MUI TextField for the player's name */}
              <TextField
                fullWidth
                label="Enter player's name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* MUI Button to insert the player */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleInsertPlayer}
              >
                Add Player
              </Button>
            </Grid>
          </Grid>

          <hr
            style={{
              height: "2px",
              backgroundColor: "gray",
              border: "none",
              margin: "10px 0",
            }}
          />

          {/* Match insertion form */}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="playerA-label">Select Player A</InputLabel>
                <Select
                  labelId="playerA-label"
                  name="playerAId"
                  value={match.playerAId}
                  onChange={handleMatchChange}
                  label="Select Player A"
                >
                  {players.map((player) => (
                    <MenuItem key={player._id} value={player._id}>
                      {player.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={2}>
              <TextField
                type="number"
                name="scoreA"
                value={match.scoreA}
                onChange={handleMatchChange}
                label="Score A"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="playerB-label">Select Player B</InputLabel>
                <Select
                  labelId="playerB-label"
                  name="playerBId"
                  value={match.playerBId}
                  onChange={handleMatchChange}
                  label="Select Player B"
                >
                  {players.map((player) => (
                    <MenuItem key={player._id} value={player._id}>
                      {player.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={2}>
              <TextField
                type="number"
                name="scoreB"
                value={match.scoreB}
                onChange={handleMatchChange}
                label="Score B"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleInsertMatch}
                fullWidth
              >
                Add Match
              </Button>
            </Grid>
          </Grid>

          <hr
            style={{
              height: "2px",
              backgroundColor: "gray",
              border: "none",
              margin: "10px 0",
            }}
          />
          {matches.map((match) => {
            // Find playerA and playerB details using their IDs
            const playerADetails = players.find(
              (player) => player._id === match.playerA
            );
            const playerBDetails = players.find(
              (player) => player._id === match.playerB
            );

            // Get player names, fallback to 'Unknown' if not found
            const playerAName = playerADetails
              ? playerADetails.name
              : "Unknown";
            const playerBName = playerBDetails
              ? playerBDetails.name
              : "Unknown";

            return (
              <div key={match._id}>
                <p>
                  {playerAName} ({match.scoreA}) vs ({match.scoreB}){" "}
                  {playerBName}
                </p>
              </div>
            );
          })}
        </Grid>
      </Grid>
    </div>
  );
}
