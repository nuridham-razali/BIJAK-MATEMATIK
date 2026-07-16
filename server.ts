import express from "express";
import path from "path";
import cors from "cors";
import Stripe from "stripe";
import { createServer as createViteServer } from "vite";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_12345";
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia" as any,
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Use JSON parser for all non-webhook routes
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (req.originalUrl === "/api/stripe/webhook") {
        next();
      } else {
        express.json()(req, res, next);
      }
    }
  );

  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { email } = req.body;
      const appUrl = process.env.APP_URL || "http://localhost:3000";

      if (STRIPE_SECRET_KEY === "sk_test_12345") {
        // Mock response if using fallback key
        return res.json({ url: `${appUrl}/payment-success?session_id=mock_session_123&email=${encodeURIComponent(email)}` });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "myr",
              product_data: {
                name: "Lesen Seumur Hidup - Bijak Matematik",
                description: "Akses tanpa had untuk 1 Keluarga (sehingga 5 murid)",
              },
              unit_amount: 5000, // RM 50.00
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/payment-failed`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Simulated Webhook (for prototype purposes, normally handled by Stripe)
  // In a real app, this would use express.raw({type: 'application/json'}) to verify signatures.
  app.post("/api/stripe/webhook", express.json(), (req, res) => {
    const event = req.body;
    // We would verify event here
    console.log("Webhook received:", event.type);
    res.json({ received: true });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
