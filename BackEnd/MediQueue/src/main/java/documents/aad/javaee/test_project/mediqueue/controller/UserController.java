package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.ApiResponse;
import documents.aad.javaee.test_project.mediqueue.dto.RegisterDto;
import documents.aad.javaee.test_project.mediqueue.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

   private final AuthService authService;

   @PostMapping("/register")
   public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDto registerDto) {

      System.out.println("fsldkfj");

      return ResponseEntity.ok(
              new ApiResponse(
                      200,
                      "User registered successfully",
                      authService.registerUser(registerDto))
      );

   }

}
