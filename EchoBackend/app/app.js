// import express from 'express';
// import cors from "cors";
// import postRoutes from '../routes/posts.js'
// import {supabase} from "file:///C:/Users/Vaibhav%20Sharma/Desktop/codes/Echo/EchoBackend/app/supabase.js"

// const app = express();

// app.use(cors());

// app.use(express.json());
// app.use('/api/v1/posts',postRoutes);
// app.use('/api/v1/user',postRoutes);
// const PORT = 3000;



// app.listen(PORT, () =>{
//     console.log(`Server is running on port ${PORT}`);
// })
import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth.js";  // Import auth routes
import postRoutes from "../routes/posts.js";
import userRoutes from '../routes/users.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/api/v1/auth", authRoutes);  // Add auth routes
app.use("/posts", postRoutes); // Posts routes
app.use('/users', userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



