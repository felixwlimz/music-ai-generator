import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { env } from "~/env";

const polarPlugins = [];

if (env.POLAR_ACCESS_TOKEN && env.POLAR_WEBHOOK_SECRET) {
  try {
    const { Polar } = require("@polar-sh/sdk");
    const {
      polar,
      checkout,
      portal,
      webhooks,
    } = require("@polar-sh/better-auth");

    const polarClient = new Polar({
      accessToken: env.POLAR_ACCESS_TOKEN,
      server: "sandbox",
    });

    polarPlugins.push(
      polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
          checkout({
            products: [
              {
                productId: "6b66b33a-ebd2-426f-8258-cffb1266e2eb",
                slug: "small",
              },
              {
                productId: "bd707895-1f94-452d-9308-8a3dce1c871d",
                slug: "medium",
              },
              {
                productId: "e4bdfc49-d885-4a6d-9b03-bc3950dbf059",
                slug: "large",
              },
            ],
            successUrl: "/",
            authenticatedUsersOnly: true,
          }),
          portal(),
          webhooks({
            secret: env.POLAR_WEBHOOK_SECRET,
            onOrderPaid: async (order: any) => {
              const externalCustomerId = order.data.customer.externalId;

              if (!externalCustomerId) {
                console.error("No external customer ID found.");
                throw new Error("No external customer id found.");
              }

              const productId = order.data.productId;

              let creditsToAdd = 0;

              switch (productId) {
                case "6b66b33a-ebd2-426f-8258-cffb1266e2eb":
                  creditsToAdd = 10;
                  break;
                case "bd707895-1f94-452d-9308-8a3dce1c871d":
                  creditsToAdd = 25;
                  break;
                case "e4bdfc49-d885-4a6d-9b03-bc3950dbf059":
                  creditsToAdd = 50;
                  break;
              }

              await db.user.update({
                where: { id: externalCustomerId },
                data: {
                  credits: {
                    increment: creditsToAdd,
                  },
                },
              });
            },
          }),
        ],
      }) as any
    );
  } catch (error) {
    console.warn("Polar plugin not available:", error);
  }
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: polarPlugins,
});