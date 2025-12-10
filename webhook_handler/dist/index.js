import express from "express";
const app = express();
// app.get('/root', (req, res) => {
//     res.send("hello")
// })
app.use(express.json());
app.post('/hdfcWebhook', (req, res) => {
    const paymentInformation = {
        token: req.body.token, // FIX 2: match names
        userId: req.body.userId
    };
    console.log("Webhook received:", paymentInformation);
    res.json({ status: "received" });
});
app.listen(3002, () => {
    console.log("Webhook Server is running on 3002");
});
//# sourceMappingURL=index.js.map