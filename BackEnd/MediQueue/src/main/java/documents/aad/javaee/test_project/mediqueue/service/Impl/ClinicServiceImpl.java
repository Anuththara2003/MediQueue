package documents.aad.javaee.test_project.mediqueue.service.Impl;


import documents.aad.javaee.test_project.mediqueue.dto.ClinicDto;
import documents.aad.javaee.test_project.mediqueue.dto.ClinicSaveDto;
import documents.aad.javaee.test_project.mediqueue.entity.Clinic;
import documents.aad.javaee.test_project.mediqueue.entity.Hospital;
import documents.aad.javaee.test_project.mediqueue.repostry.ClinicRepository;
import documents.aad.javaee.test_project.mediqueue.repostry.HospitalRepository;
import documents.aad.javaee.test_project.mediqueue.service.ClinicService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicServiceImpl implements ClinicService {

    private final ClinicRepository clinicRepository;
    private final ModelMapper modelMapper;
    private final HospitalRepository hospitalRepository;

    @Override
    public List<ClinicDto> getClinicsByHospital(Long hospitalId) {

        List<Clinic> clinics = clinicRepository.findByHospital_Id(hospitalId);
        return clinics.stream()
                .map(clinic -> modelMapper.map(clinic, ClinicDto.class))
                .collect(Collectors.toList());
    }
    public void deleteClinic(Integer id) {
        clinicRepository.deleteById(id);
    }

    @Override
    public ClinicSaveDto updateClinic(Long id, ClinicSaveDto clinicSaveDto) {
        Clinic clinic = clinicRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        clinic.setName(clinicSaveDto.getName());
        clinic.setStartTime(clinicSaveDto.getStartTime());
        clinic.setEndTime(clinicSaveDto.getEndTime());

        Hospital hospital = hospitalRepository.findById(Math.toIntExact(clinicSaveDto.getHospitalId()))
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        clinic.setHospital(hospital);

        Clinic saved = clinicRepository.save(clinic);

        return new ClinicSaveDto(
                saved.getId(),
                saved.getName(),
                saved.getStartTime(),
                saved.getEndTime(),
                saved.getHospital().getId(),
                saved.getHospital().getName()
        );

    }

    @Override
    public ClinicDto getClinicById(Integer id) {
        Clinic clinic = clinicRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new RuntimeException("Clinic not found with id " + id));
        return mapToClinicDto(clinic);
    }



    private ClinicDto mapToClinicDto(Clinic clinic) {
        return null;
    }


}
