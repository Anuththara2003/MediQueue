package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.ClinicDto;
import documents.aad.javaee.test_project.mediqueue.dto.ClinicSaveDto;

import java.util.List;

public interface ClinicService {
    List<ClinicDto> getClinicsByHospital(Long hospitalId);
    void deleteClinic(Integer id);
    ClinicSaveDto updateClinic(Long id, ClinicSaveDto  ClinicSaveDto );
    ClinicDto getClinicById(Integer id);
}
