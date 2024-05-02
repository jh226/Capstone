const express = require('express');
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
 
app.use('/api', userRoutes);

app.listen(PORT,()=>{
    console.log(`server running on PORT ${PORT}`);
})