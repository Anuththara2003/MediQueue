package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.ClinicDto;

import java.util.List;

public interface ClinicService {
    List<ClinicDto> getClinicsByHospital(Long hospitalId);
}
