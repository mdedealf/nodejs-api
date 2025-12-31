import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from movie routes!" });
});

router.get("/hello", (req, res) => {
  res.json({ message: "Hello from movie routes!" });
});

router.post("/", (req, res) => {
  res.json({ httpMethod: "POST" });
});

router.put("/", (req, res) => {
  res.json({ httpMethod: "PUT" });
});

router.delete("/", (req, res) => {
  res.json({ httpMethod: "DELETE" });
});

export default router;
