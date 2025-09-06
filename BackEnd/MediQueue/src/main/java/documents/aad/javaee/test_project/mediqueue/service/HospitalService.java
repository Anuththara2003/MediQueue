package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.HospitalDto;
import documents.aad.javaee.test_project.mediqueue.entity.Hospital;

import java.util.List;

public interface HospitalService {


    List<Hospital> getAllHospitals();
    HospitalDto addHospital(HospitalDto hospitalDto);
    HospitalDto updateHospital(Integer id, HospitalDto hospitalDto);
    void deleteHospital(Integer id);
    Hospital getHospitalById(Long id);
    List<HospitalDto> searchHospitals(String query);


}