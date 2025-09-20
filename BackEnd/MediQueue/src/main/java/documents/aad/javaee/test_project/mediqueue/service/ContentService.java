package documents.aad.javaee.test_project.mediqueue.service;

// මේ DTO එකත් අලුතින් හදන්න ඕන
import documents.aad.javaee.test_project.mediqueue.dto.HealthTipDto;

import java.util.List;

public interface ContentService {
    HealthTipDto createHealthTip(HealthTipDto healthTipDto);
    List<HealthTipDto> getAllHealthTips();
}