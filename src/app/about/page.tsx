import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { Star } from "@mui/icons-material";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const metadata = {
  title: "About the Game",
};

// Fetch game statistics from Firebase Firestore
async function fetchGameStats() {
  const scoresCollection = collection(db, "scores");
  const snapshot = await getDocs(scoresCollection);

  const scores = snapshot.docs.map((doc) => doc.data() as { name: string; score: number });
  const totalPlayers = scores.length;
  const highestScore = scores.reduce((max, curr) => (curr.score > max ? curr.score : max), 0);
  const averageScore =
    totalPlayers > 0 ? scores.reduce((sum, curr) => sum + curr.score, 0) / totalPlayers : 0;

  return {
    totalPlayers,
    highestScore,
    averageScore: Math.round(averageScore), // Round to the nearest integer
  };
}

export default async function AboutPage() {
  const gameStats = await fetchGameStats();

  return (
    <Box
      p={4}
      sx={{
        backgroundColor: "#000",
        color: "#f4d03f",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ color: "#f4d03f" }}>
        About the Circle Clicker Game
      </Typography>
      <Typography variant="h6" paragraph sx={{ color: "#f4d03f" }}>
        Welcome to the Circle Clicker Game! Test your reflexes and aim for the top of the leaderboard by clicking on as many circles as possible before time runs out.
      </Typography>
      <Box mt={4}>
        <Typography variant="h5" sx={{ color: "#f4d03f", fontWeight: "bold" }}>
          Game Statistics:
        </Typography>
        <List>
          <ListItem>
            <Star sx={{ color: "gold", marginRight: "10px" }} />
            <ListItemText
              primary={`Total Players: ${gameStats.totalPlayers}`}
              primaryTypographyProps={{ style: { color: "#f4d03f" } }}
            />
          </ListItem>
          <ListItem>
            <Star sx={{ color: "gold", marginRight: "10px" }} />
            <ListItemText
              primary={`Highest Score: ${gameStats.highestScore}`}
              primaryTypographyProps={{ style: { color: "#f4d03f" } }}
            />
          </ListItem>
          <ListItem>
            <Star sx={{ color: "gold", marginRight: "10px" }} />
            <ListItemText
              primary={`Average Score: ${gameStats.averageScore}`}
              primaryTypographyProps={{ style: { color: "#f4d03f" } }}
            />
          </ListItem>
        </List>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f4d03f",
            color: "#000",
            fontWeight: "bold",
            mt: 2,
            "&:hover": { backgroundColor: "#cda434" },
          }}
          href="/destinations"
        >
          Play the Game
        </Button>
      </Box>
    </Box>
  );
}
