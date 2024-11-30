import React from "react";
import { PaymentSuccessPage } from "@/app/components/PaymentSuccess";

type Params = { id: string };

const Page = ({ params }: { params: Params }) => {
  // Extract the `id` directly from `params`
  const { id } = params;

  return <PaymentSuccessPage reservationId={id} />;
};

export default Page;
