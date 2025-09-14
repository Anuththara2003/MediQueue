package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class AnalyticsResponseDto {
    private long totalTokens;
    private double averageWaitTimeMinutes;
    private String busiestClinic;
    private long smsSentCount;
    private Map<String, Long> tokenDistributionByHospital; // Chart සඳහා
}