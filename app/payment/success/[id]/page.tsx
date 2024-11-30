// app/payment/success/[id]/page.tsx

import { PaymentSuccessPage } from "@/app/components/PaymentSuccess";

type Params = Promise<{ id: string }>

const Page = async ({ params }: { params: Params }) => {
  const resolvedParams = await params
  return <PaymentSuccessPage reservationId={resolvedParams.id} />;
}

export default Page