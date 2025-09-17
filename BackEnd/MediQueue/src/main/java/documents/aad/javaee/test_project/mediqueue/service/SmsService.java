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

    // application.properties එකෙන් Twilio credentials ලබාගැනීම
    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    public void sendApproachingTurnSms(Token nextToken) {

        // 1. Template එක මෙහිදී සෘජුවම නිර්වචනය කිරීම
        String messageTemplate = "Hello {patient_name}, your token {token_number} at {clinic_name} is approaching. Please be ready.";

        User patient = nextToken.getPatient();

        // 2. Template එකෙන් පණිවිඩය සකස් කිරීම
        String messageBody = messageTemplate
                .replace("{patient_name}", patient.getFirstName())
                .replace("{token_number}", String.valueOf(nextToken.getTokenNumber()))
                .replace("{clinic_name}", nextToken.getQueue().getClinic().getName());

        // 3. Notification object එකක් නිර්මාණය කිරීම
        Notification notification = new Notification();
        notification.setPatient(patient);
        notification.setToken(nextToken);
        notification.setMessage(messageBody);
        notification.setNotificationType(NotificationType.SMS);
        notification.setStatus(NotificationStatus.PENDING);

        // 4. SMS එක යැවීමට උත්සහ කිරීම
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
            // 6. SMS එක අසාර්ථක නම්, notification එකේ status එක update කිරීම
            notification.setStatus(NotificationStatus.FAILED); // FAILED අගයක් ඔබගේ Enum එකේ ඇත්නම් එය යොදන්න
            System.err.println("Error sending SMS: " + e.getMessage());
        } finally {
            // 7. සාර්ථක උනත්, අසාර්ථක උනත්, notification log එක database එකේ save කිරීම
            notificationRepository.save(notification);
        }
    }
}