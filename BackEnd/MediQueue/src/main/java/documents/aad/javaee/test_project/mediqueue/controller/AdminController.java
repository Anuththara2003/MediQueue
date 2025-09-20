package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.*;
import documents.aad.javaee.test_project.mediqueue.entity.Hospital;
import documents.aad.javaee.test_project.mediqueue.service.AdminService;
import documents.aad.javaee.test_project.mediqueue.service.HospitalService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    private final HospitalService hospitalService;

    @GetMapping("/hospitals_names") //
    public ResponseEntity<List<HospitalDto>> getAllHospitals() {
        List<Hospital> hospitalList = hospitalService.getAllHospitals();
        List<HospitalDto> hospitalDtoList = hospitalList.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(hospitalDtoList);
    }

    @GetMapping("/hospitals")
    public ResponseEntity<ApiResponse> getAllHospitals(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search
    ) {


        Page<SecondHospitalDto> hospitalPage = hospitalService.getAllHospitals(search, page, size);

        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "successfully get all hospitals",
                        hospitalPage
                )
        );
    }


    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse> getHospitalSuggestions(
            @RequestParam("search") String search) {

        List<String> suggestions = hospitalService.getHospitalNameSuggestions(search);

        return ResponseEntity.ok(
                new ApiResponse(200, "Suggestions retrieved successfully", suggestions)
        );
    }


    private HospitalDto convertToDto(Hospital hospital) {
        HospitalDto dto = new HospitalDto();
        dto.setId(hospital.getId().intValue());
        dto.setName(hospital.getName());
        dto.setLocation(hospital.getLocation());
        dto.setStatus(hospital.getStatus());
        dto.setClinicCount(hospital.getClinicCount());
        return dto;
    }

    @GetMapping("/hospitals/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable Long id) {
        Hospital hospital = hospitalService.getHospitalById(id);
        return ResponseEntity.ok(hospital);
    }

    // POST /api/v1/admin/hospitals
    @PostMapping("/hospitals")
    public ResponseEntity<HospitalDto> addHospital(@RequestBody HospitalDto hospitalDto) {
        return new ResponseEntity<>(hospitalService.addHospital(hospitalDto), HttpStatus.CREATED);
    }

    // PUT /api/v1/admin/hospitals/{id}
    @PutMapping("/hospitals/{id}")
    public ResponseEntity<HospitalDto> updateHospital(@PathVariable Integer id, @RequestBody HospitalDto hospitalDto) {
        return ResponseEntity.ok(hospitalService.updateHospital(id, hospitalDto));
    }

    // DELETE /api/v1/admin/hospitals/{id}
    @DeleteMapping("/hospitals/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable Integer id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.noContent().build();
    }



    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("profileDto") AdminProfileDto profileDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        String username = userDetails.getUsername();

        try {
            adminService.updateProfile(username, profileDto, profileImage);
            return ResponseEntity.ok("Profile updated successfully!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save image: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating profile: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<AdminProfileViewDto> getProfileDetails(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        AdminProfileViewDto adminProfile = adminService.getAdminProfile(username);
        return ResponseEntity.ok(adminProfile);
    }


    @PostMapping("/clinics")
    public ResponseEntity<ApiResponse> createClinic(@RequestBody ClinicSaveDto clinicSaveDto) {
        try {
            adminService.addClinic(clinicSaveDto);
            return ResponseEntity.ok(new ApiResponse(201, "Clinic created successfully!", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(400, e.getMessage(), null));
        }
    }

    @GetMapping("/clinics_names") //
    public ResponseEntity<ApiResponse> getAllClinics() {
        try {
            List<ClinicSaveDto> clinics = adminService.getAllClinics();
            return ResponseEntity.ok(new ApiResponse(200, "Clinics fetched successfully!", clinics));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(500, e.getMessage(), null));
        }
    }


    @GetMapping("/clinics")
    public ResponseEntity<ApiResponse> getAllClinics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ClinicSaveDto> clinicPage = adminService.getAllClinics(page, size);

        return ResponseEntity.ok(
                new ApiResponse(200, "All clinics retrieved successfully", clinicPage)
        );
    }



}