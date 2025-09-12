package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.entity.TokenStatus;
import documents.aad.javaee.test_project.mediqueue.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}