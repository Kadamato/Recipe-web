import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { connectToMongoDB } from "../database/connectToDB";
import mongoose from "mongoose";

let adapter: MongodbAdapter | null = null;

const initializeAdapter = async (): Promise<MongodbAdapter> => {
  await connectToMongoDB();

  if (!adapter) {
    adapter = new MongodbAdapter(
      mongoose.connection.collection("sessions"),
      mongoose.connection.collection("users")
    );
  }

  return adapter;
};

export default initializeAdapter;
