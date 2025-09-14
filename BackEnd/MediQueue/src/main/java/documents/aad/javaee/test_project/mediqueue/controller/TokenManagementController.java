package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.QueueTokenDto;
import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import documents.aad.javaee.test_project.mediqueue.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/tokens") // Admin ට අදාළ URL
public class TokenManagementController {

    @Autowired
    private TokenService tokenService;

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

}