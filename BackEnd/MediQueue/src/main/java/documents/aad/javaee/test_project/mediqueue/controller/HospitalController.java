package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.HospitalDto;
import documents.aad.javaee.test_project.mediqueue.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hospitals") // පොදු URL එකක්
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;

    // Search query එකක් අනුව hospitals return කරන endpoint එක
    @GetMapping("/search")
    public ResponseEntity<List<HospitalDto>> searchHospitals(@RequestParam String query) {
        List<HospitalDto> hospitals = hospitalService.searchHospitals(query);
        return ResponseEntity.ok(hospitals);
    }
}