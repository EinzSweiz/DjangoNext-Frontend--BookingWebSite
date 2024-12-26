"use client";
import { useState, useEffect } from "react";
import { Range } from "react-date-range";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";
import apiService from "@/app/services/apiService";
import DatePicker from "@/app/forms/Calendar";
import useLoginModal from "@/app/hooks/useLoginModal";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

export type Property = {
  id: string;
  guests: number;
  price_per_night: number;
};

interface ReservationSidebarProps {
  userId: string | null;
  property: Property;
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
  property,
  userId,
}) => {
  const loginModal = useLoginModal();
  const [fee, setFee] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [nights, setNights] = useState<number>(1);
  const [guests, setGuests] = useState<string>("1");
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const guestsRange = Array.from(
    { length: property.guests },
    (_, index) => index + 1
  );

  const performBooking = async () => {
    if (userId) {
      if (dateRange.startDate && dateRange.endDate) {
        const formData = new FormData();
        formData.append("guests", guests);
        formData.append(
          "start_date",
          format(dateRange.startDate, "yyyy-MM-dd")
        );
        formData.append("end_date", format(dateRange.endDate, "yyyy-MM-dd"));
        formData.append("number_of_nights", nights.toString());
        formData.append("total_price", totalPrice.toString());

        const response = await apiService.post(
          `/api/properties/${property.id}/book/`,
          formData
        );
        if (response) {
          // Redirect to the Stripe checkout page
          window.location.href = response.url;
        } else {
          console.log("Something went wrong...");
        }
      }
    } else {
      loginModal.open();
    }
  };

  const _setDateRange = (selection: any) => {
    const newStartDate = new Date(selection.startDate);
    const newEndDate = new Date(selection.endDate);
    if (newEndDate <= newStartDate) {
      newEndDate.setDate(newStartDate.getDate() + 1);
    }
    setDateRange({
      ...dateRange,
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  const getReservations = async () => {
    try {
      const reservations = await apiService.get(
        `/api/properties/${property.id}/reservations/`
      );
      let dates: Date[] = [];
      reservations.forEach((reservation: any) => {
        const range = eachDayOfInterval({
          start: new Date(reservation.start_date),
          end: new Date(reservation.end_date),
        });
        dates = [...dates, ...range];
      });
      setBookedDates(dates);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    getReservations();
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(
        dateRange.endDate,
        dateRange.startDate
      );
      if (dayCount && property.price_per_night) {
        const _fee = (dayCount * property.price_per_night * 0.05); // 5% fee
        setFee(_fee);
        setTotalPrice(dayCount * property.price_per_night + _fee);
        setNights(dayCount);
      } else {
        const _fee = property.price_per_night * 0.05; // 5% fee
        setFee(_fee);
        setTotalPrice(property.price_per_night + _fee);
        setNights(1);
      }
    }
  }, [dateRange]);

  return (
    <aside className="mt-6 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl relative">
      <h2 className="mb-5 text-2xl">
        ${property.price_per_night} <span className="text-sm">per night</span>
      </h2>
      {/* DatePicker wrapped in relative container */}
      <div className="relative">
        <DatePicker
          value={dateRange}
          onChange={(value) => _setDateRange(value.selection)}
          bookedDates={bookedDates}
        />
      </div>
      <div className="mb-6 p-3 border border-gray-400 rounded-xl">
        <label className="mb-2 font-bold block text-xs">Guests</label>
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full -ml-1 text-xm"
        >
          {guestsRange.map((number) => (
            <option value={number} key={number}>
              {number}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div className="mb-4 flex justify-between align-center">
        <p>
          ${property.price_per_night} * {nights} nights
        </p>
        <p>${property.price_per_night * nights}</p>
      </div>
      <div className="mb-4 flex justify-between align-center">
        <p>Service fee</p>
        <p>${fee}</p>
      </div>
      <hr />
      <div className="mb-4 flex justify-between align-center font-bold">
        <p>Total</p>
        <p>${totalPrice}</p>
      </div>
      <div
        onClick={performBooking}
        className="cursor-pointer w-full mb-6 py-2 text-center text-white bg-airbnb rounded-xl hover:bg-airbnb-dark"
      >
        Book
      </div>
    </aside>
  );
};

export default ReservationSidebar;
