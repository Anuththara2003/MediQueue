package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.DashboardDataDto;

public interface DashboardService {
    DashboardDataDto getPatientDashboardData(Long patientId);
}
