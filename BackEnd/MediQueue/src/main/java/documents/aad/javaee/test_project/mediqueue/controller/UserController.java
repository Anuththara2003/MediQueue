package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.ApiResponse;
import documents.aad.javaee.test_project.mediqueue.dto.AuthDto;
import documents.aad.javaee.test_project.mediqueue.dto.AuthResponseDto;
import documents.aad.javaee.test_project.mediqueue.dto.RegisterDto;
import documents.aad.javaee.test_project.mediqueue.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasAuthority('ADMIN')")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class UserController {



   private final AuthService authService;
   private final AuthenticationManager authenticationManager;

   @PostMapping("/register")
   public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDto registerDto) {
      return ResponseEntity.ok(
              new ApiResponse(
                      200,
                      "User registered successfully",
                      authService.registerUser(registerDto))
      );

   }

   @PostMapping("/login")
   public ResponseEntity<ApiResponse> loginUser(@RequestBody AuthDto authDto) {
      authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(authDto.getUsername(), authDto.getPassword()));
      AuthResponseDto authResponse = authService.generateTokenForUser(authDto.getUsername());
      ApiResponse apiResponse = new ApiResponse(
              HttpStatus.OK.value(),
              "Login Successful",
              authResponse
      );

      return ResponseEntity.ok(apiResponse);
   }

}
