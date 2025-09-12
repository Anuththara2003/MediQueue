package documents.aad.javaee.test_project.mediqueue.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AppointmentCardDto {
    private String clinicName;
    private String doctorName;
    private String hospitalName;
    private String doctorContact;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

}