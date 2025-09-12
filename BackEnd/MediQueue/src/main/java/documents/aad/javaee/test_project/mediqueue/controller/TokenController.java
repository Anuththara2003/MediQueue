package documents.aad.javaee.test_project.mediqueue.controller;

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
            // Service එක call කර, token එක save කරගන්නවා
            Token createdToken = tokenService.createToken(tokenRequestDto);

            // **වෙනස මෙතනයි:** සම්පූර්ණ object එක වෙනුවට,
            // සරල Map (JSON object) එකක්, සාර්ථක පණිවිඩයක් සහ token අංකය සමඟ යවනවා.
            return new ResponseEntity<>(
                    Map.of(
                            "message", "Token created successfully!",
                            "tokenNumber", createdToken.getTokenNumber()
                    ),
                    HttpStatus.CREATED
            );
        } catch (Exception e) {

            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
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
}
