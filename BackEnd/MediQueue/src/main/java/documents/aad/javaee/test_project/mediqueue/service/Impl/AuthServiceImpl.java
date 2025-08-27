package documents.aad.javaee.test_project.mediqueue.service.Impl;

import documents.aad.javaee.test_project.mediqueue.dto.ApiResponse;
import documents.aad.javaee.test_project.mediqueue.dto.AuthDto;
import documents.aad.javaee.test_project.mediqueue.dto.AuthResponseDto;
import documents.aad.javaee.test_project.mediqueue.dto.RegisterDto;
import documents.aad.javaee.test_project.mediqueue.entity.User;
import documents.aad.javaee.test_project.mediqueue.repostry.UserRepository;
import documents.aad.javaee.test_project.mediqueue.service.AuthService;
import documents.aad.javaee.test_project.mediqueue.utill.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public Object registerUser(RegisterDto registerDto) {
        if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
             throw new RuntimeException("User already exists");
        }

        User user = User.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(registerDto.getRole())
                .firstName(registerDto.getFirstName())
                .lastName(registerDto.getLastName())
                .contactNumber(registerDto.getContactNumber())
                .dateOfBirth(registerDto.getDateOfBirth())
                .gender(registerDto.getGender())
                .build();

        return userRepository.save(user);
    }
    public AuthResponseDto authenticateUser(AuthDto authDto) {
        User user = userRepository.findByUsername(authDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(
                authDto.getPassword(),
                user.getPassword())) {
            throw new BadCredentialsException("Invalid Credentials");
        }
        String token = jwtUtil.generateToken(authDto.getUsername());
        return new AuthResponseDto(token,user.getRole().name());
    }
}
