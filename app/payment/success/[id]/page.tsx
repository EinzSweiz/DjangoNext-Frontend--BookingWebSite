// app/payment/success/[id]/page.tsx

import React from "react";
import { PaymentSuccessPage } from "@/app/components/PaymentSuccess";

type Params = Promise<{ id: string }>

const Page = ({ params }: { params: Params }) => {
  const resolvedParams = params

  return <PaymentSuccessPage reservationId={resolvedParams} />;
}

export default Page