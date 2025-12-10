import express from "express";
import axios from "axios";
const app = express();

// app.get('/root', (req, res) => {
//     res.send("hello")
// })

app.use(express.json())

app.post('/hdfcWebhook', async (req, res) => {
    const paymentInformation = {
        token: req.body.token,  // FIX 2: match names
        userId: req.body.userId,
        amount: req.body.amount

    }
    

    console.log("Calling to Paytm server")
    const sendtopaytm = await axios.post("http://localhost:3000/dbupdate", {
        paymentInformation
    });

    console.log("Webhook received:", paymentInformation);
    //res.json({message: "A post request was sended to paytm"})
})

app.listen(3002, () => {
    console.log("Webhook Server is running on 3002")
})