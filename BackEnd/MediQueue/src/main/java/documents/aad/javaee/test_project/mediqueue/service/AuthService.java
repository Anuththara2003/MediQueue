package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.AuthDto;
import documents.aad.javaee.test_project.mediqueue.dto.AuthResponseDto;
import documents.aad.javaee.test_project.mediqueue.dto.RegisterDto;

import java.util.Optional;

public interface AuthService {
    Object registerUser(RegisterDto registerDto);

    AuthResponseDto authenticateUser(AuthDto authDto);
}
