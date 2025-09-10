package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.DoctorRegisterDto;
import documents.aad.javaee.test_project.mediqueue.entity.Doctor;
import documents.aad.javaee.test_project.mediqueue.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // URL: http://localhost:8080/api/v1/admin/doctors
    @PostMapping("/saved")
    public ResponseEntity<?> registerNewDoctor(@Valid @RequestBody DoctorRegisterDto doctorDto) {

        try {
            Doctor savedDoctor = doctorService.registerDoctor(doctorDto);
            return new ResponseEntity<>(savedDoctor, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @GetMapping ("/load")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

}