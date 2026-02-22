"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function Upgrade() {
  const upgrade = async () => {
    // @ts-ignore - Polar plugin adds checkout method
    await authClient.checkout({
      products: [
        "6b66b33a-ebd2-426f-8258-cffb1266e2eb",
        "bd707895-1f94-452d-9308-8a3dce1c871d",
        "e4bdfc49-d885-4a6d-9b03-bc3950dbf059",
      ],
    });
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2 cursor-pointer text-orange-400"
      onClick={upgrade}
    >
      Upgrade
    </Button>
  );
}