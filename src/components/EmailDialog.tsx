import { useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";

export default function EmailDialog({ scores }: { scores: any[] }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // Add a state for the name
  const reportRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendEmail = async () => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, scores }), // Include name in the request body
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Email sent successfully:", data);
      } else {
        console.error("Error sending email:", data.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }

    handleClose();
  };

  return (
    <Box>
      {/* Button to Open Dialog */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#f4d03f",
          color: "#000",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#cda434",
          },
        }}
        onClick={handleOpen}
      >
        Send Scores via Email
      </Button>

      {/* Dialog Popup */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            border: "2px solid #f4d03f",
            boxShadow: "0 0 20px 5px #f4d03f",
            borderRadius: "12px",
            backgroundColor: "#000",
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#000", color: "#f4d03f", textAlign: "center" }}>
          Send Scores via Email
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#333", color: "#f4d03f" }}>
          {/* Input for Name */}
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
                backgroundColor: "#222",
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
          {/* Input for Email */}
          <TextField
            label="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#f4d03f",
                backgroundColor: "#222",
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
          {/* Scores Report Section */}
          <div ref={reportRef} style={{ padding: "10px", backgroundColor: "#222", borderRadius: "8px", marginTop: "20px" }}>
            <h3 style={{ color: "#f4d03f" }}>Scores Report</h3>
            <table style={{ width: "100%", color: "#fff", textAlign: "left" }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score: { name: string; score: number }, index: number) => (
                  <tr key={index}>
                    <td>{score.name}</td>
                    <td>{score.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#000" }}>
          <Button
            onClick={handleClose}
            sx={{
              color: "#f4d03f",
              "&:hover": {
                color: "#cda434",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            sx={{
              backgroundColor: "#f4d03f",
              color: "#000",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#cda434",
              },
            }}
          >
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
