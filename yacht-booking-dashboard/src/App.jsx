import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { useBookingState } from './hooks';

// Pages
import BookingCalendar from './pages/BookingCalendar';
import BookingList from './pages/BookingList';
import DayDetail from './pages/DayDetail';
import YachtSettings from './pages/YachtSettings';
import { SavedUsers } from './pages/fractional';

function App() {
  const [calendarMode, setCalendarMode] = useState('regular'); // 'regular' or 'fractional'

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

  // Filter yachts based on calendar mode
  const filteredYachts = activeYachts.filter(y => {
    if (calendarMode === 'fractional') {
      return y.yachtType === 'FRACTIONAL';
    }
    return y.yachtType !== 'FRACTIONAL' || !y.yachtType;
  });

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
      <MainLayout calendarMode={calendarMode} onModeChange={setCalendarMode}>
        <Routes>
          {/* Calendar */}
          <Route
            path="/"
            element={
              <BookingCalendar
                yachts={filteredYachts}
                bookings={bookings}
                getBookingsForDate={getBookingsForDate}
                calendarMode={calendarMode}
              />
            }
          />

          {/* Day Detail - booking */}
          <Route
            path="/day/:dateStr"
            element={
              <DayDetail
                yachts={filteredYachts}
                bookings={bookings}
                addBooking={addBooking}
                updateBooking={updateBooking}
                deleteBooking={deleteBooking}
                getBookingsForDate={getBookingsForDate}
                getAvailableSlots={getAvailableSlots}
                isSlotBooked={isSlotBooked}
                calendarMode={calendarMode}
              />
            }
          />

          {/* Booking List */}
          <Route
            path="/bookings"
            element={
              <BookingList
                bookings={bookings}
                yachts={yachts}
                updateBooking={updateBooking}
                deleteBooking={deleteBooking}
              />
            }
          />

          {/* Yacht Settings */}
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

          {/* Saved Users */}
          <Route path="/users" element={<SavedUsers />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
