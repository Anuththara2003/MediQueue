package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.HospitalDto;
import documents.aad.javaee.test_project.mediqueue.dto.SecondHospitalDto;
import documents.aad.javaee.test_project.mediqueue.entity.Hospital;
import org.springframework.data.domain.Page;

import java.util.List;

public interface HospitalService {


    List<Hospital> getAllHospitals();
    HospitalDto addHospital(HospitalDto hospitalDto);
    HospitalDto updateHospital(Integer id, HospitalDto hospitalDto);
    void deleteHospital(Integer id);
    Hospital getHospitalById(Long id);
    List<HospitalDto> searchHospitals(String query);


    Page<SecondHospitalDto> getAllHospitals(String search, int page, int size);

    List<String> getHospitalNameSuggestions(String search);
}