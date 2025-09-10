package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.ClinicDto;
import documents.aad.javaee.test_project.mediqueue.dto.ClinicSaveDto;
import documents.aad.javaee.test_project.mediqueue.service.ClinicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clinics")
@RequiredArgsConstructor
public class ClinicController {


    private final ClinicService clinicService;

    @GetMapping("/by-hospital/{hospitalId}")
    public ResponseEntity<List<ClinicDto>> getClinicsByHospital(@PathVariable Long hospitalId) {
        List<ClinicDto> clinics = clinicService.getClinicsByHospital(hospitalId);
        return ResponseEntity.ok(clinics);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClinic(@PathVariable Integer id) {
        clinicService.deleteClinic(id);
        return ResponseEntity.ok("Clinic deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClinicSaveDto> updateClinic(
            @PathVariable Long id,
            @RequestBody ClinicSaveDto clinicSaveDto) {
        ClinicSaveDto updated = clinicService.updateClinic(id, clinicSaveDto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClinicDto> getClinicById(@PathVariable Integer id) {
        ClinicDto clinic = clinicService.getClinicById((int) Math.toIntExact(id));
        return ResponseEntity.ok(clinic);
    }


}