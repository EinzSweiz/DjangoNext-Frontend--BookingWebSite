// app/payment/success/[id]/page.tsx

import { PaymentSuccessPage } from "@/app/components/PaymentSuccess";

export default function Page({ params }: { params: { id: string } }) {
  return <PaymentSuccessPage reservationId={params.id} />;
}
