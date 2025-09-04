package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.HospitalDto;
import documents.aad.javaee.test_project.mediqueue.entity.Hospital;
import documents.aad.javaee.test_project.mediqueue.service.HospitalService; // Interface එක import කරන්න
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
//@CrossOrigin ("*")
//@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AdminController {

    @Autowired
    private HospitalService hospitalService;
    // GET /api/v1/admin/hospitals
    @GetMapping("/hospitals")
    public ResponseEntity<List<HospitalDto>> getAllHospitals() {
        List<Hospital> hospitalList = hospitalService.getAllHospitals();

        // 2. Java Stream API එක භාවිතා කර, එකින් එක Hospital entity, HospitalDto බවට පත් කිරීම
        List<HospitalDto> hospitalDtoList = hospitalList.stream()
                .map(this::convertToDto) // සෑම hospital එකක් සඳහාම convertToDto method එක call කරයි
                .collect(Collectors.toList());

        // 3. DTO ලැයිස්තුව front-end එකට යැවීම
        return ResponseEntity.ok(hospitalDtoList);
    }

    // === මෙම convertToDto method එක Controller එකටත් එකතු කරන්න ===
// (Service එකේ ඇති method එකමයි, නමුත් controller එක තුළත් තිබීම අවශ්‍යයි)
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
        // hospitalService එක හරහා database එකෙන් hospital එක සොයා ගැනීම
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
}