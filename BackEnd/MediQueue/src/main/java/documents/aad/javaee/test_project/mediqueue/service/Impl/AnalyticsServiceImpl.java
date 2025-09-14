package documents.aad.javaee.test_project.mediqueue.service.Impl;

import documents.aad.javaee.test_project.mediqueue.dto.AnalyticsResponseDto;
import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.repostry.TokenRepository;
import documents.aad.javaee.test_project.mediqueue.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    @Autowired
    private TokenRepository tokenRepository;
    // ... (inject other repositories if needed)

    @Override
    public AnalyticsResponseDto getAnalytics(LocalDate startDate, LocalDate endDate) {
        AnalyticsResponseDto dto = new AnalyticsResponseDto();

        List<Token> tokensInPeriod = tokenRepository.findAllByQueue_QueueDateBetween(startDate, endDate);

        dto.setTotalTokens(tokensInPeriod.size());
        dto.setBusiestClinic(tokenRepository.findBusiestClinicName(startDate, endDate));

        // Avg. Wait Time (උදාහරණයක් - checkInTime සහ calledTime අතර වෙනස)
        double totalWaitSeconds = tokensInPeriod.stream()
                .filter(t -> t.getCheckInTime() != null && t.getCalledTime() != null)
                .mapToLong(t -> Duration.between(t.getCheckInTime(), t.getCalledTime()).getSeconds())
                .sum();
        dto.setAverageWaitTimeMinutes(tokensInPeriod.isEmpty() ? 0 : (totalWaitSeconds / 60.0) / tokensInPeriod.size());

        // SMS Sent (දැනට dummy අගයක්)
        dto.setSmsSentCount(31250);

        // Token Distribution for Chart
        List<Map<String, Object>> distribution = tokenRepository.countTokensByHospital(startDate, endDate);
        Map<String, Long> distributionMap = distribution.stream()
                .collect(Collectors.toMap(
                        map -> (String) map.get("hospitalName"),
                        map -> (Long) map.get("tokenCount")
                ));
        dto.setTokenDistributionByHospital(distributionMap);

        return dto;
    }
}