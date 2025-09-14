package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.AnalyticsResponseDto;

import java.time.LocalDate;

public interface AnalyticsService {
    AnalyticsResponseDto getAnalytics(LocalDate startDate, LocalDate endDate);
}
