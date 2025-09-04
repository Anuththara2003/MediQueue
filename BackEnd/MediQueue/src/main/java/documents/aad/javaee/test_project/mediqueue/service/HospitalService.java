package documents.aad.javaee.test_project.mediqueue.service;

import documents.aad.javaee.test_project.mediqueue.dto.HospitalDto;
import documents.aad.javaee.test_project.mediqueue.entity.Hospital;

import java.util.List;

public interface HospitalService {

    // සියලුම රෝහල් ලබාගැනීමට
    List<Hospital> getAllHospitals();

    // අලුත් රෝහලක් එකතු කිරීමට
    HospitalDto addHospital(HospitalDto hospitalDto);

    // රෝහලක් update කිරීමට
    HospitalDto updateHospital(Integer id, HospitalDto hospitalDto);

    // රෝහලක් මකා දැමීමට
    void deleteHospital(Integer id);
    Hospital getHospitalById(Long id);


}