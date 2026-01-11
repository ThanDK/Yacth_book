import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { useBookingState } from './hooks';

// Pages
import BookingCalendar from './pages/BookingCalendar';
import BookingList from './pages/BookingList';
import DayDetail from './pages/DayDetail';
import YachtSettings from './pages/YachtSettings';

function App() {
  const {
    yachts,
    bookings,
    activeYachts,
    addBooking,
    updateBooking,
    deleteBooking,
    addYacht,
    updateYacht,
    deleteYacht,
    isSlotBooked,
    getBookingsForDate,
    getAvailableSlots,
    isLoading,
    error
  } = useBookingState();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={
              <BookingCalendar
                yachts={activeYachts}
                bookings={bookings}
                getBookingsForDate={getBookingsForDate}
              />
            }
          />
          <Route
            path="/day/:dateStr"
            element={
              <DayDetail
                yachts={activeYachts}
                bookings={bookings}
                addBooking={addBooking}
                updateBooking={updateBooking}
                deleteBooking={deleteBooking}
                getBookingsForDate={getBookingsForDate}
                getAvailableSlots={getAvailableSlots}
                isSlotBooked={isSlotBooked}
              />
            }
          />
          <Route
            path="/bookings"
            element={
              <BookingList
                bookings={bookings}
                yachts={yachts}
                updateBooking={updateBooking}
                deleteBooking={deleteBooking}
                yachtService={yachts} // Pass yachts if needed, but BookingList uses it
              />
            }
          />
          <Route
            path="/yachts"
            element={
              <YachtSettings
                yachts={yachts}
                bookings={bookings}
                addYacht={addYacht}
                updateYacht={updateYacht}
                deleteYacht={deleteYacht}
              />
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
