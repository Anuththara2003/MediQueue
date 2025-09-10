package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.UserResponseDto;
import documents.aad.javaee.test_project.mediqueue.entity.Role;

import java.util.List;

public interface UserService {
    List<UserResponseDto> getAllUsers();
    List<UserResponseDto> getUsersByRole(Role role);
    void deleteUser(Long id);

}