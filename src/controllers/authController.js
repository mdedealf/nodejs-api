import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists in the database
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        status: "error",
        message: "User already exists",
        data: null,
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT Token
    const token = generateToken(user.id, res);

    res.status(201).json({
      success: true,
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      success: false,
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user email exists in the table
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        status: "error",
        message: "Invalid email or password",
        data: null,
      });
    }

    // Verify password
    const isPassowordValid = await bcrypt.compare(password, user.password);

    if (!isPassowordValid) {
      return res.status(401).json({
        success: false,
        status: "error",
        message: "Invalid email or password",
        data: null,
      });
    }

    // Generate JWT Token
    const token = generateToken(user.id, res);

    res.status(201).json({
      success: true,
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      status: "error",
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    success: true,
    status: "success",
    message: "Logout successful",
    data: null,
  });
};

export { register, login, logout };
