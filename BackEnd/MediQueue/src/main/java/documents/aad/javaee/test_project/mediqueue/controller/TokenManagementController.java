package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.AnalyticsResponseDto;
import documents.aad.javaee.test_project.mediqueue.dto.MedicalRecordCreateDto;
import documents.aad.javaee.test_project.mediqueue.dto.QueueTokenDto;
import documents.aad.javaee.test_project.mediqueue.entity.MedicalRecord;
import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import documents.aad.javaee.test_project.mediqueue.service.AnalyticsService;
import documents.aad.javaee.test_project.mediqueue.service.MedicalRecordService;
import documents.aad.javaee.test_project.mediqueue.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/tokens") // Admin ට අදාළ URL
public class TokenManagementController {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @PatchMapping("/{tokenId}/check-in")
    public ResponseEntity<Token> checkInToken(@PathVariable Integer tokenId) {
        Token updatedToken = tokenService.updateTokenStatus(tokenId, TokenStatus.IN_PROGRESS);
        return ResponseEntity.ok(updatedToken);
    }

    @GetMapping("/queue") // URL: GET /api/v1/admin/tokens/queue?clinicId=1&date=2025-09-13
    public ResponseEntity<List<QueueTokenDto>> getQueueTokens(
            @RequestParam Integer clinicId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<QueueTokenDto> tokens = tokenService.getTokensForQueue(clinicId, date);
        return ResponseEntity.ok(tokens);
    }

    @GetMapping("/analytics/report")
    public ResponseEntity<AnalyticsResponseDto> getAnalytics(

            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        System.out.println("Fetching analytics from " + startDate + " to " + endDate);
        AnalyticsResponseDto analytics = analyticsService.getAnalytics(startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/{tokenId}/status") // URL: POST /api/v1/admin/tokens/{tokenId}/record
    public ResponseEntity<MedicalRecord> createRecordForToken(
            @PathVariable Integer tokenId,
            @Valid @RequestBody MedicalRecordCreateDto dto) {

        MedicalRecord createdRecord = medicalRecordService.createMedicalRecord(tokenId, dto);
        return new ResponseEntity<>(createdRecord, HttpStatus.CREATED);
    }

    // controller/TokenManagementController.java

    @PatchMapping("/{tokenId}/status")
    public ResponseEntity<?> updateTokenStatus(
            @PathVariable Integer tokenId,
            @RequestParam TokenStatus newStatus) {

        try {
            // Service එක call කර, token එක update කරනවා
            tokenService.updateTokenStatus(tokenId, newStatus);

            // **වෙනස මෙතනයි:** සම්පූර්ණ object එක වෙනුවට, සරල Map (JSON object) එකක් යවනවා
            return ResponseEntity.ok(Map.of("message", "Token status updated successfully to " + newStatus));

        } catch (Exception e) {
            // යම් දෝෂයක් ඇතිවුවහොත්
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}