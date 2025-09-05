package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.ApiResponse;
import documents.aad.javaee.test_project.mediqueue.dto.PasswordChangeDto;
import documents.aad.javaee.test_project.mediqueue.dto.PatientInfoUpdateDto;
import documents.aad.javaee.test_project.mediqueue.dto.PatientProfileViewDto;
import documents.aad.javaee.test_project.mediqueue.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

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
}