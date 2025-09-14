package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.*;
import documents.aad.javaee.test_project.mediqueue.entity.Doctor;
import documents.aad.javaee.test_project.mediqueue.entity.User;
import documents.aad.javaee.test_project.mediqueue.repostry.DoctorRepository;
import documents.aad.javaee.test_project.mediqueue.service.MedicalRecordService;
import documents.aad.javaee.test_project.mediqueue.service.PatientService;
import documents.aad.javaee.test_project.mediqueue.service.TokenService;
import documents.aad.javaee.test_project.mediqueue.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.SuppressAjWarnings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientController {

    private final UserService userService;
    private final PatientService patientService;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MedicalRecordService medicalRecordService;


    @GetMapping("/profile")
    public ResponseEntity<PatientProfileViewDto> getPatientProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(patientService.getPatientProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile/info")
    public ResponseEntity<ApiResponse> updatePatientInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("info") PatientInfoUpdateDto infoDto,
            @RequestPart(value = "image", required = false) MultipartFile profileImage
    ) {
        try {
            patientService.updatePatientInfo(userDetails.getUsername(), infoDto, profileImage);
            return ResponseEntity.ok(new ApiResponse(200, "Profile updated successfully", null));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse(500, "Image upload failed", null));
        }
    }

    @PutMapping("/profile/password")
    public ResponseEntity<ApiResponse> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PasswordChangeDto passwordDto
    ) {
        try {
            patientService.changePatientPassword(userDetails.getUsername(), passwordDto);
            return ResponseEntity.ok(new ApiResponse(200, "Password updated successfully", null));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(400, e.getMessage(), null));
        }
    }

    @GetMapping("/details/contact/{mobileNumber}")
    public ResponseEntity<UserResponseDto> getMyDetailsByContact(@PathVariable String mobileNumber) {
        try {
            UserResponseDto patientDto = userService.findPatientByContactNumber(mobileNumber);
            return ResponseEntity.ok(patientDto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/details/doctors") // URL: GET /api/v1/patient/doctors
    public ResponseEntity<List<Doctor>> getAvailableDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/appointments/upcoming")
    public ResponseEntity<List<AppointmentCardDto>> getMyUpcomingAppointments(Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();
        List<AppointmentCardDto> appointments = tokenService.getUpcomingAppointmentsForPatient(loggedInUser.getId());
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/appointments/history") // URL: GET /api/v1/patient/appointments/history
    public ResponseEntity<List<AppointmentCardDto>> getMyAppointmentHistory(Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();
        List<AppointmentCardDto> appointmentHistory = tokenService.getPastAppointmentsForPatient(loggedInUser.getId());
        return ResponseEntity.ok(appointmentHistory);
    }

    @GetMapping("/medical-records") // URL: GET /api/v1/patient/medical-records
    public ResponseEntity<List<MedicalRecordDto>> getMyMedicalRecords(Authentication authentication) {
        User loggedInUser = (User) authentication.getPrincipal();
        List<MedicalRecordDto> records = medicalRecordService.getMedicalRecordsForPatient(loggedInUser.getId());
        return ResponseEntity.ok(records);
    }


}