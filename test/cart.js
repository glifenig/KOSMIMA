const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
    },
});

app.post("/send-email", (req, res) => {
    const { email, phone, name, cart, totalPrice } = req.body;

    let productDetails = cart.map(item => 
        `${item.title} - ₦${item.price.toLocaleString()} x ${item.quantity}`
    ).join("\n");

    const mailOptions = {
        from: "your-email@gmail.com",
        to: email,
        subject: "Order Confirmation - GoodLife Tech Store",
        text: `
        Hello ${name},
        
        Your order has been received successfully!

        Order Details:
        ${productDetails}

        Total Amount Paid: ₦${totalPrice.toLocaleString()}

        Your phone number: ${phone}
        
        Thank you for shopping with us!
        - GoodLife Tech Store
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ success: false, message: "Failed to send email" });
        }
        res.json({ success: true, message: "Email sent successfully!" });
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
