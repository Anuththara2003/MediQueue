package documents.aad.javaee.test_project.mediqueue.service.Impl;

import documents.aad.javaee.test_project.mediqueue.Exception.ResourceNotFoundException;
import documents.aad.javaee.test_project.mediqueue.dto.HospitalDto;
import documents.aad.javaee.test_project.mediqueue.entity.Hospital;
import documents.aad.javaee.test_project.mediqueue.repostry.HospitalRepository;
import documents.aad.javaee.test_project.mediqueue.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalServiceImpl implements HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;


    @Override
    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
    }

    @Override
    public List<HospitalDto> getAllHospitals() {
        return hospitalRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public HospitalDto addHospital(HospitalDto hospitalDto) {
        Hospital hospital = new Hospital();
        hospital.setName(hospitalDto.getName());


        setLocationFieldsFromDto(hospital, hospitalDto.getLocation());

        hospital.setStatus(hospitalDto.getStatus());

        Hospital savedHospital = hospitalRepository.save(hospital);
        return convertToDto(savedHospital);
    }

    @Override
    public HospitalDto updateHospital(Integer id, HospitalDto hospitalDto) {
        Hospital existingHospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found with id: " + id));

        existingHospital.setName(hospitalDto.getName());
        existingHospital.setLocation(hospitalDto.getLocation());
        existingHospital.setStatus(hospitalDto.getStatus());

        Hospital updatedHospital = hospitalRepository.save(existingHospital);

        return convertToDto(updatedHospital);
    }


    @Override
    public void deleteHospital(Integer id) {
        if (!hospitalRepository.existsById(id)) {
            throw new RuntimeException("Hospital not found with id: " + id);
        }
        hospitalRepository.deleteById(id);
    }


    private HospitalDto convertToDto(Hospital hospital) {
        StringBuilder locationBuilder = new StringBuilder();
        if (hospital.getLocation() != null && !hospital.getLocation().isEmpty()) {
            locationBuilder.append(hospital.getLocation());
        }
        if (hospital.getAddress() != null && !hospital.getAddress().isEmpty()) {
            if (locationBuilder.length() > 0) {
                locationBuilder.append(", ");
            }
            locationBuilder.append(hospital.getAddress());
        }

        return new HospitalDto(
                Math.toIntExact(hospital.getId()),
                hospital.getName(),
                locationBuilder.toString(),
                hospital.getStatus(),
                0 // TODO: Add clinic count
        );
    }


    private void setLocationFieldsFromDto(Hospital hospital, String fullLocation) {
        if (fullLocation != null && !fullLocation.trim().isEmpty()) {
            String[] parts = fullLocation.split(",");

            if (parts.length > 0) {
                hospital.setLocation(parts[0].trim());
            }
            if (parts.length > 1) {
                hospital.setAddress(parts[1].trim());
            } else {

                hospital.setAddress(null);
            }
        } else {
            hospital.setLocation(null);
            hospital.setAddress(null);
        }
    }
}