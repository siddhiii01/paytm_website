import express from "express";
import type {Request, Response, NextFunction} from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json()); //to parse json for req.body, post, patch req 

//Logging Middleware
app.use((req: Request,res:Response, next: NextFunction) => {
    console.log("Incoming req: ");
    console.log(`req.headers: ${JSON.stringify(req.headers)}`)
    console.log(`req.bpdy: ${JSON.stringify(req.body)}`);
    console.log(`req.url: ${req.originalUrl}`);
    next();
})

app.get('/test', (req: Request, res: Response) => {
    console.log("Test Route");
    res.send('Test Route');
})

app.listen(process.env.PORT, () => {
    console.log("Server is running")
});

