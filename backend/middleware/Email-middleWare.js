const nodemailer = require('nodemailer')


const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })
}
function checkInputType(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    if (emailRegex.test(input)) {
        return "email";
    } else if (phoneRegex.test(input)) {
        return "phone";
    } else {
        return "invalid";
    }
}

const generateEmailCodeTemplate = (otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
            text-align: center;
        }
        .container {
            max-width: 90%;
            width: 400px;
            background-color: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .logo img {
            width: 40px;
        }
        .otp-box {
            background-color: #f3f3f3;
            padding: 15px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 5px;
            border-radius: 5px;
            display: inline-block;
            width: 80%;
            max-width: 250px;
        }
        .social-icons {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        }
        .social-icons a {
            text-decoration: none;
            color: #333;
            font-size: 18px;
        }
        .logo h1{
            color: #17496E;
        }
        .logo span{
            background-color: #17496E;
            color: white;
            font-size: 24px;
            padding: 0px 4px;
            border-radius: 7px;

        }
        @media (max-width: 480px) {
            .container {
                width: 95%;
                padding: 15px;
            }
            .otp-box {
                font-size: 20px;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
        <h1>ABY<span>ride</span></h1>
        </div>
        <h3>Hi there,</h3>
        <p>This is your one-time verification code.</p>
        <div class="otp-box">${otp}</div>
        <p>This code is only active for the next 5 minutes. Once the code expires, you will have to resubmit a request for a new code.</p>
        <p><strong>Keep making awesome stuff!<br>UIDux</strong></p>
        <div class="social-icons">
            <a href="#">&#x1F5E1;</a>
            <a href="#">&#x1F426;</a>
            <a href="#">&#x1F34F;</a>
        </div>
    </div>
</body>
</html>

`.split('').join('')
}


const sendMail = async (to, subject, text, html) => {
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
        from: `"Abyride" <${process.env.EMAIL_USER}>`, // Sender's email
        to, // Recipient's email
        subject, // Email subject
        text, // Plain text body
        html, // HTML body
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

const hashEmail = (identifier) => {
    return identifier
        .split('@')
        .map((part, index) =>
            index === 0 ? part[0] + '*'.repeat(part.length - 1) : part,
        )
        .join('@')
}

const verifyOtp = (otp)=>{
    if (otp == null) {
        return { success: false, message: 'otp is expired or deleted' };
      }
      if (otp !== userOtp) {
        return { success: false, message: 'invalid otp' };
      }
      if (otp == userOtp) {
        return { success: true, message: 'otp verification success' };
      }
}

const generateSixDigitNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
};


module.exports = {
    sendMail,
    generateEmailCodeTemplate,
    checkInputType,
    hashEmail,
    verifyOtp,
    generateSixDigitNumber,

}