package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.RegisterDto;

public interface AuthService {
    Object registerUser(RegisterDto registerDto);
}
