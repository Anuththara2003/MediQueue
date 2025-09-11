package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.TokenRequestDto;
import documents.aad.javaee.test_project.mediqueue.entity.Token;

public interface TokenService {
    Token createToken(TokenRequestDto tokenRequestDto);

}
