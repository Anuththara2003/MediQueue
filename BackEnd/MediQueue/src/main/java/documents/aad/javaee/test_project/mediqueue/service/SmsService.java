package documents.aad.javaee.test_project.mediqueue.service;


import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import documents.aad.javaee.test_project.mediqueue.entity.*;
import documents.aad.javaee.test_project.mediqueue.repostry.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service
public class SmsService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    public void sendApproachingSms(Token token) {

        String messageTemplate = "Hello {patient_name}, your token {token_number} at {clinic_name} is approaching. Please be ready.";

        User patient = token.getPatient();
        if (patient == null || patient.getContactNumber() == null || patient.getContactNumber().isEmpty()) {
            System.err.println("Cannot send SMS for Token ID: " + token.getId() + " because patient or contact number is missing.");
            return;
        }


        String messageBody = messageTemplate
                .replace("{patient_name}", patient.getFirstName())
                .replace("{token_number}", String.valueOf(token.getTokenNumber()))
                .replace("{clinic_name}", token.getQueue().getClinic().getName());


        Notification notification = new Notification();
        notification.setPatient(patient);
        notification.setToken(token);
        notification.setMessage(messageBody);
        notification.setNotificationType(NotificationType.SMS);
        notification.setStatus(NotificationStatus.PENDING);

        try {
            if (accountSid == null || authToken == null || fromPhoneNumber == null || accountSid.isEmpty() || authToken.isEmpty()) {
                throw new IllegalStateException("Twilio credentials are not configured in application.properties.");
            }
            Twilio.init(accountSid, authToken);


            String formattedToNumber = "+94" + patient.getContactNumber().substring(patient.getContactNumber().length() - 9);

            Message message = Message.creator(
                            new PhoneNumber(formattedToNumber),
                            new PhoneNumber(fromPhoneNumber),
                            messageBody)
                    .create();


            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            System.out.println("SMS sent to " + formattedToNumber);

        } catch (Exception e) {

            notification.setStatus(NotificationStatus.FAILED);
            System.err.println("Error sending SMS: " + e.getMessage());
        } finally {

            notificationRepository.save(notification);
        }
    }
}