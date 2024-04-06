import { OrderMailEvent } from "@ktixmix/common";

export function generateOrderEmailTemplate(data: OrderMailEvent['data']): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Order Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      h1, h2, p {
        margin: 0;
        padding: 0;
      }
      h1 {
        color: #333;
      }
      p {
        margin-bottom: 10px;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        margin-bottom: 5px;
      }
      strong {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Ticket Order Confirmation</h1>
      <p>Dear ${data.userEmail},</p>
      <p>Thank you for your order. Below are the details of your ticket purchase:</p>
      <ul>
        <li><strong>Ticket Title:</strong> ${data.ticket.title}</li>
        <li><strong>Price:</strong> $${data.ticket.price.toFixed(2)}</li>
        <li><strong>Order ID:</strong> ${data.id}</li>
      </ul>
      <p>If you have any questions or concerns regarding your order, please feel free to contact us.</p>
      <p>Thank you again for your purchase!</p>
      <p>Sincerely,<br> TixMix 🎫</p>
    </div>
  </body>
  </html>
`;
}