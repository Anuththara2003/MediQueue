package documents.aad.javaee.test_project.mediqueue.service.Impl;

// ... (imports)

import documents.aad.javaee.test_project.mediqueue.dto.DashboardDataDto;
import documents.aad.javaee.test_project.mediqueue.dto.HealthTipDto;
import documents.aad.javaee.test_project.mediqueue.entity.User;
import documents.aad.javaee.test_project.mediqueue.repostry.UserRepository;
import documents.aad.javaee.test_project.mediqueue.service.ContentService;
import documents.aad.javaee.test_project.mediqueue.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ContentService contentService;

    @Override
    public DashboardDataDto getPatientDashboardData(Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<HealthTipDto> allTips = contentService.getAllHealthTips();
        HealthTipDto randomTip = allTips.isEmpty() ? null : allTips.get(0);

        DashboardDataDto dashboardData = new DashboardDataDto();
        dashboardData.setPatientName(patient.getUsername());
        dashboardData.setHealthTip(randomTip);

        return dashboardData;
    }
}