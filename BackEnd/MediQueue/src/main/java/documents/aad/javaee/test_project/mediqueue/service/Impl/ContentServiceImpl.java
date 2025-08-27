package documents.aad.javaee.test_project.mediqueue.service.Impl;

import documents.aad.javaee.test_project.mediqueue.dto.HealthTipDto;
import documents.aad.javaee.test_project.mediqueue.entity.HealthTip;
import documents.aad.javaee.test_project.mediqueue.repostry.HealthTipRepository;
import documents.aad.javaee.test_project.mediqueue.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContentServiceImpl implements ContentService {

    private final HealthTipRepository healthTipRepository;

    @Override
    public HealthTipDto createHealthTip(HealthTipDto healthTipDto) {
        documents.aad.javaee.test_project.mediqueue.entity.HealthTip healthTip = new HealthTip();
        healthTip.setTitle(healthTipDto.getTitle());
        healthTip.setContent(healthTipDto.getContent());
        healthTip.setLanguage(healthTipDto.getLanguage());

        HealthTip savedTip = healthTipRepository.save(healthTip);

        healthTipDto.setId(savedTip.getId());
        return healthTipDto;
    }

    @Override
    public List<HealthTipDto> getAllHealthTips() {
        return healthTipRepository.findAll().stream()
                .map(tip -> new HealthTipDto(tip.getId(), tip.getTitle(), tip.getContent(), tip.getLanguage()))
                .collect(Collectors.toList());

    }
}
