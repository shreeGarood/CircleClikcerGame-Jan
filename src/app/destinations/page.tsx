"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Star } from "@mui/icons-material";
import EmailDialog from "@/components/EmailDialog";
import { requestNotificationPermission, onMessageListener } from "@/utils/notification";


interface Score {
  id: string;
  name: string;
  score: number;
}

export default function GamePage() {
  const [name, setName] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [circles, setCircles] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [timer, setTimer] = useState(10); 
  const scoreRef = useRef(0); 
  const [gameDuration] = useState(10); 
  const [latestScore, setLatestScore] = useState<Score | null>(null); 
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [notification, setNotification] = useState<any>(null);

  useEffect(() => {
    requestNotificationPermission().then((token) => {
      if (token) {
        console.log("FCM Token:", token);
        // Send the token to your backend for future notifications
      }
    });

    onMessageListener().then((payload) => {
      console.log("New notification:", payload);
      setNotification(payload);
    });
  }, []);

  useEffect(() => {
    fetch("/api/scores")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setScores(data);
        } else {
          console.error("Invalid data format from API");
          setScores([]); // Default to an empty array if data is invalid
        }
      })
      .catch((error) => {
        console.error("Error fetching scores:", error);
        setScores([]); // Handle errors gracefully
      });
  }, []);
  

  useEffect(() => {
    if (isGameActive) {
      const interval = setInterval(() => {
        const newCircle = {
          id: Math.random().toString(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10, 
        };
        setCircles((prev) => [...prev, newCircle]);
        setTimeout(() => {
          setCircles((prev) =>
            prev.filter((circle) => circle.id !== newCircle.id)
          );
        }, 1000);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isGameActive]);

  useEffect(() => {
    if (isGameActive && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [isGameActive, timer]);

  const startGame = () => {
    setIsGameActive(true);
    setScore(0); 
    scoreRef.current = 0; 
    setTimer(gameDuration);

    setTimeout(() => {
      setIsGameActive(false);
      saveScore();
      setName("");
    }, gameDuration * 1000);
  };

  const saveScore = async () => {
    try {
      const finalScore = scoreRef.current; 
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score: finalScore }),
      });

      if (response.ok) {
        const newScore = await response.json();
        console.log("Response from API:", newScore);

        setScores((prev) => [...prev, newScore]);
        setLatestScore(newScore);

        setSnackbar({
          open: true,
          message: newScore?.message || "Score added successfully!",
          severity: "success",
        });

        setTimeout(() => setLatestScore(null), 3000); 
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to save score");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: (error as Error).message || "An unexpected error occurred.",
        severity: "error",
      });
    }
  };

  const handleCircleClick = (id: string) => {
    setScore((prev) => {
      const newScore = prev + 1;
      scoreRef.current = newScore; 
      return newScore;
    });
    setCircles((prev) => prev.filter((circle) => circle.id !== id));
  };

  const sortedScores = Array.isArray(scores) ? scores.sort((a, b) => b.score - a.score) : [];

  const highestScore = sortedScores[0];

  // const handleRematch = (id: string) => {
  //   setIsGameActive(true);
  //   setScore(0); 
  //   scoreRef.current = 0; 
  //   setTimer(gameDuration); 

  //   setTimeout(() => {
  //     setIsGameActive(false);
  //     updateScore(id, scoreRef.current); 
  //   }, gameDuration * 1000);
  // };

  // const updateScore = async (id: string, newScore: number) => {
  //   try {
  //     const response = await fetch(`/api/scores/${id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ score: newScore }),
  //     });

  //     if (response.ok) {
  //       const updatedScore = await response.json();
  //       setScores((prevScores) =>
  //         prevScores.map((score) =>
  //           score.id === id ? { ...score, score: updatedScore.score } : score
  //         )
  //       );
  //       setLatestScore(updatedScore);

  //       setSnackbar({
  //         open: true,
  //         message: "Score updated successfully!",
  //         severity: "success",
  //       });

  //       setTimeout(() => setLatestScore(null), 3000); 
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Error response:", errorData);
  //       throw new Error(errorData.error || "Failed to update score");
  //     }
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: (error as Error).message || "An unexpected error occurred.",
  //       severity: "error",
  //     });
  //   }
  // };

  // const handleDelete = async (id: string) => {
  //   try {
  //     const response = await fetch(`/api/scores/${id}`, {
  //       method: "DELETE",
  //     });

  //     if (response.ok) {
  //       setScores((prevScores) =>
  //         prevScores.filter((score) => score.id !== id)
  //       );

  //       setSnackbar({
  //         open: true,
  //         message: "Score deleted successfully!",
  //         severity: "success",
  //       });
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Error response:", errorData);
  //       throw new Error(errorData.error || "Failed to delete score");
  //     }
  //   } catch (error) {
  //     setSnackbar({
  //       open: true,
  //       message: (error as Error).message || "An unexpected error occurred.",
  //       severity: "error",
  //     });
  //   }
  // };

  const handleClearAll = async () => {
    try {
      const response = await fetch("/api/scores", {
        method: "DELETE",
      });

      if (response.ok) {
        setScores([]); 

        setSnackbar({
          open: true,
          message: "All scores cleared successfully!",
          severity: "success",
        });
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to clear scores");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: (error as Error).message || "An unexpected error occurred.",
        severity: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  return (
    <Box
      p={4}
      sx={{
        backgroundColor: "#000",
        color: "#f4d03f",
        minHeight: "100vh",
      }}
    >
      {!isGameActive && (
        <Box
          mb={4}
          textAlign="center"
          sx={{
            backgroundColor: "#000",
            border: "2px solid #f4d03f",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "#f4d03f" }}>
            Welcome to the Circle Clicker Game!
          </Typography>
          <TextField
            label="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#f4d03f", 
                backgroundColor: "#333", 
                borderColor: "#f4d03f", 
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f1c40f",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f1c40f", 
                },
              },
              "& .MuiInputLabel-root": {
                color: "#f4d03f", 
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#f1c40f", 
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={startGame}
            disabled={!name.trim()}
            sx={{
              backgroundColor: "#f4d03f",
              color: "#000",
              fontWeight: "bold",
              marginTop: "10px",
              "&:hover": {
                backgroundColor: "#cda434",
              },
            }}
          >
            Start Game
          </Button>
        </Box>
      )}

      {isGameActive && (
        <Box
          position="relative"
          width="100%"
          height="400px"
          border="1px solid #f4d03f"
          borderRadius="8px"
          overflow="hidden"
          sx={{ backgroundColor: "#000" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              right: "20px",
              backgroundColor: "#333",
              color: "#f4d03f",
              padding: "8px 12px",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            Score: {score}
          </Box>
          <LinearProgress
            variant="determinate"
            value={(timer / gameDuration) * 100}
            sx={{
              height: "8px",
              position: "absolute",
              top: 0,
              width: "100%",
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#f4d03f",
              },
            }}
          />

          {circles.map((circle) => (
            <motion.div
              key={circle.id}
              onClick={() => handleCircleClick(circle.id)}
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "red",
                borderRadius: "50%",
                position: "absolute",
                top: `${circle.y}%`,
                left: `${circle.x}%`,
                cursor: "pointer",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.5,
              }}
            />
          ))}
        </Box>
      )}

      <Box mt={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" sx={{ color: "#f4d03f" }}>
            Score Table
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleClearAll}
            sx={{
              backgroundColor: "#f4d03f",
              color: "#000",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#cda434",
              },
            }}
          >
            CLEAR ALL
          </Button>
        </Box>
        {sortedScores.length > 0 && (
          <Paper sx={{ backgroundColor: "#000", border: "2px solid #f4d03f" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#f4d03f", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "#f4d03f", fontWeight: "bold" }}>
                    Score
                  </TableCell>
                  <TableCell sx={{ color: "#f4d03f", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                  <TableCell sx={{ color: "#f4d03f", fontWeight: "bold" }}>
                    Rating
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedScores.map((score, index) => (
                  <TableRow
                    key={score.id}
                    style={{
                      backgroundColor:
                        latestScore?.id === score.id
                          ? "#404040"
                          : highestScore?.id === score.id
                          ? "black"
                          : "transparent",
                    }}
                  >
                    <TableCell sx={{ color: "#f4d03f" }}>
                      {score.name}
                    </TableCell>
                    <TableCell sx={{ color: "#f4d03f" }}>
                      {score.score}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        // onClick={() => handleRematch(score.id)}
                        sx={{
                          borderColor: "#f4d03f",
                          color: "#f4d03f",
                          "&:hover": {
                            backgroundColor: "#333",
                          },
                        }}
                      >
                        Rematch
                      </Button>
                      <Button
                        variant="outlined"
                        // onClick={() => handleDelete(score.id)}
                        sx={{
                          borderColor: "#f4d03f",
                          color: "#f4d03f",
                          marginLeft: "8px",
                          "&:hover": {
                            backgroundColor: "#333",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                    <TableCell sx={{ color: "#f4d03f" }}>
                      {index === 0 && (
                        <>
                          <Star sx={{ color: "gold" }} />
                          <Star sx={{ color: "gold" }} />
                          <Star sx={{ color: "gold" }} />
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <Star sx={{ color: "gold" }} />
                          <Star sx={{ color: "gold" }} />
                        </>
                      )}
                      {index === 2 && <Star sx={{ color: "gold" }} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>

      {/* Add Email Dialog */}
      <Box textAlign="right" mt={4}>
        <EmailDialog scores={scores} />
      </Box>
      

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionProps={{
          onEnter: (node) => node.classList.add("slide-in"),
          onExit: (node) => node.classList.add("slide-out"),
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            background: "linear-gradient(90deg, #f4d03f, #f1c40f)",
            color: "#000",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
