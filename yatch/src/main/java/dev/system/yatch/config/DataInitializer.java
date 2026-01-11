package dev.system.yatch.config;

import dev.system.yatch.dto.common.TimeSlotDTO;
import dev.system.yatch.entity.Booking;
import dev.system.yatch.entity.SavedUser;
import dev.system.yatch.entity.Yacht;
import dev.system.yatch.enums.BookingStatus;
import dev.system.yatch.enums.UserType;
import dev.system.yatch.enums.YachtType;
import dev.system.yatch.repository.BookingRepository;
import dev.system.yatch.repository.SavedUserRepository;
import dev.system.yatch.repository.YachtRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class DataInitializer {

        private final YachtRepository yachtRepository;
        private final BookingRepository bookingRepository;
        private final SavedUserRepository savedUserRepository;

        @Bean
        public CommandLineRunner initData() {
                return args -> {
                        seedYachts();
                        seedBookings();
                        seedSavedUsers();
                };
        }

        private void seedYachts() {
                if (yachtRepository.count() > 0) {
                        log.info("Yachts already exist. Skipping seed.");
                        return;
                }
                log.info("Seeding Yachts...");

                // 1. Blue Ocean
                Yacht blueOcean = Yacht.builder()
                                .id("1")
                                .name("Blue Ocean")
                                .description("เรือยอร์ชหรู 20 ที่นั่ง")
                                .capacity(20)
                                .isActive(true)
                                .timeSlots(List.of(
                                                new TimeSlotDTO("slot-1a", "09:00", "11:00", "รอบเช้า"),
                                                new TimeSlotDTO("slot-1b", "13:00", "15:00", "รอบบ่าย"),
                                                new TimeSlotDTO("slot-1c", "16:00", "18:00", "รอบเย็น")))
                                .createdAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                                .updatedAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                                .build();

                // 2. Sunset Dream
                Yacht sunsetDream = Yacht.builder()
                                .id("2")
                                .name("Sunset Dream")
                                .description("เรือชมพระอาทิตย์ตก 15 ที่นั่ง")
                                .capacity(15)
                                .isActive(true)
                                .timeSlots(List.of(
                                                new TimeSlotDTO("slot-2a", "16:00", "18:00", "รอบพระอาทิตย์ตก 1"),
                                                new TimeSlotDTO("slot-2b", "18:00", "20:00", "รอบพระอาทิตย์ตก 2")))
                                .createdAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                                .updatedAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                                .build();

                // 3. Sea Explorer
                Yacht seaExplorer = Yacht.builder()
                                .id("3")
                                .name("Sea Explorer")
                                .description("เรือสำรวจทะเล 30 ที่นั่ง")
                                .capacity(30)
                                .isActive(true)
                                .timeSlots(List.of(
                                                new TimeSlotDTO("slot-3a", "08:00", "12:00", "รอบเช้า (ครึ่งวัน)"),
                                                new TimeSlotDTO("slot-3b", "13:00", "17:00", "รอบบ่าย (ครึ่งวัน)")))
                                .dateOverrides(Map.of(
                                                "2026-01-15",
                                                List.of(new TimeSlotDTO("special-3a", "09:00", "17:00",
                                                                "⭐ Full Day Special"))))
                                .createdAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                                .updatedAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                                .build();

                // 4. Cokoa (FRACTIONAL yacht)
                Yacht cokoa = Yacht.builder()
                                .id("4")
                                .name("Cokoa")
                                .description("🔒 Fractional Yacht - 15 ที่นั่ง")
                                .capacity(15)
                                .isActive(true)
                                .yachtType(YachtType.FRACTIONAL)
                                .timeSlots(List.of(
                                                new TimeSlotDTO("slot-4a", "09:00", "12:00", "รอบเช้า"),
                                                new TimeSlotDTO("slot-4b", "14:00", "17:00", "รอบบ่าย")))
                                .createdAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                                .updatedAt(LocalDateTime.of(2026, 1, 1, 0, 0))
                                .build();

                yachtRepository.saveAll(List.of(blueOcean, sunsetDream, seaExplorer, cokoa));
                log.info("Seeded 4 Yachts (3 Regular, 1 Fractional).");
        }

        private void seedBookings() {
                if (bookingRepository.count() > 0) {
                        log.info("Bookings already exist. Skipping seed.");
                        return;
                }
                log.info("Seeding Bookings...");

                List<Booking> bookings = List.of(
                                // 1
                                Booking.builder()
                                                .bookingId("YB-2026-0001")
                                                .yachtId("1").yachtName("Blue Ocean")
                                                .slotId("slot-1a").slotLabel("รอบเช้า").slotStart("09:00")
                                                .slotEnd("11:00")
                                                .serviceDate(LocalDate.of(2026, 1, 15))
                                                .customerName("สมชาย ใจดี")
                                                .phone("081-234-5678").email("somchai@email.com")
                                                .rewardId("RW-12345").tokenTxTime("10:30")
                                                .status(BookingStatus.CONFIRMED).emailSent(true)
                                                .notes("")
                                                .createdAt(LocalDateTime.of(2026, 1, 9, 10, 30))
                                                .updatedAt(LocalDateTime.of(2026, 1, 9, 10, 30))
                                                .build(),

                                // 2
                                Booking.builder()
                                                .bookingId("YB-2026-0002")
                                                .yachtId("1").yachtName("Blue Ocean")
                                                .slotId("slot-1b").slotLabel("รอบบ่าย").slotStart("13:00")
                                                .slotEnd("15:00")
                                                .serviceDate(LocalDate.of(2026, 1, 15))
                                                .customerName("สมหญิง รักษ์โลก")
                                                .phone("089-876-5432").email("somying@email.com")
                                                .rewardId("RW-67890").tokenTxTime("14:00")
                                                .status(BookingStatus.PENDING).emailSent(false)
                                                .notes("ลูกค้า VIP")
                                                .createdAt(LocalDateTime.of(2026, 1, 10, 14, 0))
                                                .updatedAt(LocalDateTime.of(2026, 1, 10, 14, 0))
                                                .build(),

                                // 3
                                Booking.builder()
                                                .bookingId("YB-2026-0003")
                                                .yachtId("2").yachtName("Sunset Dream")
                                                .slotId("slot-2a").slotLabel("รอบพระอาทิตย์ตก 1").slotStart("16:00")
                                                .slotEnd("18:00")
                                                .serviceDate(LocalDate.of(2026, 1, 16))
                                                .customerName("วิชัย มั่งมี")
                                                .phone("062-111-2222").email("wichai@email.com")
                                                .rewardId("RW-11111").tokenTxTime("09:00")
                                                .status(BookingStatus.PROCESSING).emailSent(true)
                                                .notes("")
                                                .createdAt(LocalDateTime.of(2026, 1, 8, 9, 0))
                                                .updatedAt(LocalDateTime.of(2026, 1, 8, 9, 0))
                                                .build(),

                                // 4
                                Booking.builder()
                                                .bookingId("YB-2026-0004")
                                                .yachtId("3").yachtName("Sea Explorer")
                                                .slotId("slot-3a").slotLabel("รอบเช้า (ครึ่งวัน)").slotStart("08:00")
                                                .slotEnd("12:00")
                                                .serviceDate(LocalDate.of(2026, 1, 17))
                                                .customerName("อรุณ ตื่นเช้า")
                                                .phone("091-333-4444").email("arun@email.com")
                                                .rewardId("RW-22222").tokenTxTime("11:30")
                                                .status(BookingStatus.CONFIRMED).emailSent(true)
                                                .notes("มากับครอบครัว 5 คน")
                                                .createdAt(LocalDateTime.of(2026, 1, 7, 11, 30))
                                                .updatedAt(LocalDateTime.of(2026, 1, 7, 11, 30))
                                                .build(),

                                // 5
                                Booking.builder()
                                                .bookingId("YB-2026-0005")
                                                .yachtId("2").yachtName("Sunset Dream")
                                                .slotId("slot-2b").slotLabel("รอบพระอาทิตย์ตก 2").slotStart("16:00")
                                                .slotEnd("18:00")
                                                .serviceDate(LocalDate.of(2026, 1, 15))
                                                .customerName("ประภา แสงจันทร์")
                                                .phone("084-555-6666").email("prapa@email.com")
                                                .rewardId("RW-33333").tokenTxTime("16:00")
                                                .status(BookingStatus.CANCELLED).emailSent(true)
                                                .notes("")
                                                .cancelReason("ลูกค้าขอยกเลิก - ติดธุระ")
                                                .createdAt(LocalDateTime.of(2026, 1, 6, 16, 0))
                                                .updatedAt(LocalDateTime.of(2026, 1, 10, 10, 0))
                                                .build(),

                                // 6 (Stress Test)
                                Booking.builder()
                                                .bookingId("YB-2026-0006")
                                                .yachtId("1").yachtName("Blue Ocean")
                                                .slotId("slot-1c").slotLabel("รอบเย็น").slotStart("16:00")
                                                .slotEnd("18:00")
                                                .serviceDate(LocalDate.of(2026, 1, 15))
                                                .customerName("โทนี่ สตาร์ค")
                                                .phone("099-999-9999").email("ironman@avengers.com")
                                                .rewardId("RW-99999").tokenTxTime("09:00")
                                                .status(BookingStatus.CONFIRMED).emailSent(true)
                                                .notes("ขอเพลง Rock")
                                                .createdAt(LocalDateTime.of(2026, 1, 12, 9, 0))
                                                .updatedAt(LocalDateTime.of(2026, 1, 12, 9, 0))
                                                .build(),

                                // 7 (Stress Test - Special Override)
                                Booking.builder()
                                                .bookingId("YB-2026-0007")
                                                .yachtId("3").yachtName("Sea Explorer")
                                                .slotId("special-3a").slotLabel("⭐ Full Day Special").slotStart("09:00")
                                                .slotEnd("17:00")
                                                .serviceDate(LocalDate.of(2026, 1, 15))
                                                .customerName("Monkey D. Luffy")
                                                .phone("088-777-6666").email("luffy@pirate.com")
                                                .rewardId("RW-PIRATE").tokenTxTime("10:00")
                                                .status(BookingStatus.CONFIRMED).emailSent(true)
                                                .notes("ต้องการเนื้อเยอะๆ")
                                                .createdAt(LocalDateTime.of(2026, 1, 13, 10, 0))
                                                .updatedAt(LocalDateTime.of(2026, 1, 13, 10, 0))
                                                .build());

                bookingRepository.saveAll(bookings);
                log.info("Seeded 7 Bookings.");
        }

        private void seedSavedUsers() {
                if (savedUserRepository.count() > 0) {
                        log.info("Saved Users already exist. Skipping seed.");
                        return;
                }
                log.info("Seeding Saved Users...");

                List<SavedUser> users = List.of(
                                // Regular users
                                SavedUser.builder()
                                                .userId("U-0001")
                                                .name("สมชาย ใจดี")
                                                .email("somchai@email.com")
                                                .phone("081-234-5678")
                                                .userType(UserType.REGULAR)
                                                .isActive(true)
                                                .notes("ลูกค้าประจำ")
                                                .createdAt(LocalDateTime.now())
                                                .updatedAt(LocalDateTime.now())
                                                .build(),
                                SavedUser.builder()
                                                .userId("U-0002")
                                                .name("สมหญิง รักษ์โลก")
                                                .email("somying@email.com")
                                                .phone("089-876-5432")
                                                .userType(UserType.REGULAR)
                                                .isActive(true)
                                                .notes("VIP Customer")
                                                .createdAt(LocalDateTime.now())
                                                .updatedAt(LocalDateTime.now())
                                                .build(),
                                // Fractional users
                                SavedUser.builder()
                                                .userId("U-0003")
                                                .name("Tod Fractional")
                                                .email("tod@fractional.com")
                                                .phone("026-161-651")
                                                .userType(UserType.FRACTIONAL)
                                                .isActive(true)
                                                .notes("เจ้าของหุ้น Cokoa")
                                                .createdAt(LocalDateTime.now())
                                                .updatedAt(LocalDateTime.now())
                                                .build(),
                                SavedUser.builder()
                                                .userId("U-0004")
                                                .name("วีระ นักลงทุน")
                                                .email("weera@investor.com")
                                                .phone("091-999-8888")
                                                .userType(UserType.FRACTIONAL)
                                                .isActive(true)
                                                .notes("Fractional Owner")
                                                .createdAt(LocalDateTime.now())
                                                .updatedAt(LocalDateTime.now())
                                                .build());

                savedUserRepository.saveAll(users);
                log.info("Seeded 4 Saved Users (2 Regular, 2 Fractional).");
        }
}
