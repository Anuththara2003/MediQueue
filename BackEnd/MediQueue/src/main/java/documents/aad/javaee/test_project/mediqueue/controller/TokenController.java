package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.QueueStatusDto;
import documents.aad.javaee.test_project.mediqueue.dto.TokenDetailsDto;
import documents.aad.javaee.test_project.mediqueue.dto.TokenRequestDto;
import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.User;
import documents.aad.javaee.test_project.mediqueue.service.TokenService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/patient/tokens") // Base URL එක patient ට අදාළව
public class TokenController {

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity<?> createToken(@Valid @RequestBody TokenRequestDto tokenRequestDto) {
        try {

            Token createdToken = tokenService.createToken(tokenRequestDto);


            return new ResponseEntity<>(
                    Map.of(
                            "message", "Token created successfully!",
                            "tokenNumber", createdToken.getTokenNumber(),
                            "tokenId", createdToken.getId()
                    ),
                    HttpStatus.CREATED
            );
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // අනෙකුත් දෝෂ සඳහා
            return new ResponseEntity<>(Map.of("error", "An unexpected error occurred."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/latest-active")
    public ResponseEntity<?> getMyLatestActiveToken(Authentication authentication) {
        try {

            User loggedInUser = (User) authentication.getPrincipal();

            TokenDetailsDto tokenDetails = tokenService.getLatestActiveTokenForPatient(loggedInUser.getId());
            return ResponseEntity.ok(tokenDetails);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PatchMapping("/{tokenId}/cancel") // URL: PATCH /api/v1/patient/tokens/{tokenId}/cancel
    public ResponseEntity<?> cancelMyToken(@PathVariable Integer tokenId, Authentication authentication) {
        try {
            User loggedInUser = (User) authentication.getPrincipal();
            Integer patientId = loggedInUser.getId();

            tokenService.cancelToken(tokenId, patientId);

            return ResponseEntity.ok(Map.of("message", "Token has been successfully cancelled."));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            // User, token එකේ හිමිකරු නොවන විට
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/live-status") // URL: GET /api/v1/patient/token/live-status
    public ResponseEntity<?> getMyLiveTokenStatus(Authentication authentication) {
        try {
            User loggedInUser = (User) authentication.getPrincipal();
            QueueStatusDto statusDto = tokenService.getLiveQueueStatusForPatient(loggedInUser.getId());
            return ResponseEntity.ok(statusDto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }




}
