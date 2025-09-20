package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.HospitalDto;
import documents.aad.javaee.test_project.mediqueue.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hospitals") // පොදු URL එකක්
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;

    @GetMapping("/search")
    public ResponseEntity<List<HospitalDto>> searchHospitals(@RequestParam String query) {
        List<HospitalDto> hospitals = hospitalService.searchHospitals(query);
        return ResponseEntity.ok(hospitals);
    }
}