import mongoose from "mongoose";

async function main() {
  const DB = process.env.MONGO_URL;
  try {
    await mongoose.connect(DB);
    console.log("Connection Successfully");
  } catch (error) {
    console.log(error);
    console.log("Connection Error");
  }
}

export default main;