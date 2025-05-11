
package com.example.library;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api")
public class StudentController {

    @GetMapping("/me")
    public ResponseEntity<?> getProfile() {
        // Dummy return for frontend testing
        return ResponseEntity.ok(new Student("John Doe", "STU123", "john@example.com", "9876543210", 12, "2025-05-01", "2025-05-31"));
    }

    static class Student {
        public String name, studentId, email, phone, startDate, endDate;
        public int shiftHours;
        Student(String name, String studentId, String email, String phone, int shiftHours, String startDate, String endDate) {
            this.name = name; this.studentId = studentId; this.email = email; this.phone = phone;
            this.shiftHours = shiftHours; this.startDate = startDate; this.endDate = endDate;
        }
    }
}
