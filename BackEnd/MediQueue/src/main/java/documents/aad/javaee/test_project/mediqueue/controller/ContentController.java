package documents.aad.javaee.test_project.mediqueue.controller;



import documents.aad.javaee.test_project.mediqueue.dto.HealthTipDto;
import documents.aad.javaee.test_project.mediqueue.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content") // සම්පූර්ණයෙන්ම අලුත් URL path එකක්
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService; // අලුත් service එක පමණක් inject කරයි

    // GET http://localhost:8080/api/content/tips
    @GetMapping("/tips")
    public ResponseEntity<List<HealthTipDto>> getAllTips() {
        return ResponseEntity.ok(contentService.getAllHealthTips());
    }

    // POST http://localhost:8080/api/content/tips
    @PostMapping("/tips")
    public ResponseEntity<HealthTipDto> addNewTip(@RequestBody HealthTipDto healthTipDto) {
        HealthTipDto createdTip = contentService.createHealthTip(healthTipDto);
        return new ResponseEntity<>(createdTip, HttpStatus.CREATED);
    }
}
