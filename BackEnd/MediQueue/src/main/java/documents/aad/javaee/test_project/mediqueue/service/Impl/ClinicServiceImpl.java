package documents.aad.javaee.test_project.mediqueue.service.Impl;


import documents.aad.javaee.test_project.mediqueue.dto.ClinicDto;
import documents.aad.javaee.test_project.mediqueue.entity.Clinic;
import documents.aad.javaee.test_project.mediqueue.repostry.ClinicRepository;
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

    @Override
    public List<ClinicDto> getClinicsByHospital(Long hospitalId) {
        // අදාළ Hospital ID එකෙන් clinics ටික database එකෙන් හොයනවා
        List<Clinic> clinics = clinicRepository.findByHospital_Id(hospitalId);

        // Clinic entities ටික, ClinicDto වලට convert කරලා return කරනවා
        return clinics.stream()
                .map(clinic -> modelMapper.map(clinic, ClinicDto.class))
                .collect(Collectors.toList());
    }
}
