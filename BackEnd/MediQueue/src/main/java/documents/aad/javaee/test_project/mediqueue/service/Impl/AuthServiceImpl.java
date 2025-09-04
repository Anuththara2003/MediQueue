package documents.aad.javaee.test_project.mediqueue.service.Impl;



import documents.aad.javaee.test_project.mediqueue.dto.AuthDto;
import documents.aad.javaee.test_project.mediqueue.dto.AuthResponseDto;
import documents.aad.javaee.test_project.mediqueue.dto.RegisterDto;
import documents.aad.javaee.test_project.mediqueue.entity.Role;
import documents.aad.javaee.test_project.mediqueue.entity.User;
import documents.aad.javaee.test_project.mediqueue.repostry.UserRepository;
import documents.aad.javaee.test_project.mediqueue.service.AuthService;
import documents.aad.javaee.test_project.mediqueue.utill.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public Object registerUser(RegisterDto registerDto) {
        if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
            throw new RuntimeException("User with this username already exists");
        }

        User user = User.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .role(Role.valueOf(registerDto.getRole()))
                .firstName(registerDto.getFirstName())
                .lastName(registerDto.getLastName())
                .contactNumber(registerDto.getContactNumber())
                .dateOfBirth(registerDto.getDateOfBirth())
                .gender(registerDto.getGender())
                .build();

        return userRepository.save(user);
    }


    @Override
    public AuthResponseDto generateTokenForUser(String username) {

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found after successful authentication"));

        String token = jwtUtil.generateToken(user);

        return AuthResponseDto.builder()
                .accessToken(token)
                .role(user.getRole().name())
                .build();
    }
}