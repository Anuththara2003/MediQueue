package documents.aad.javaee.test_project.mediqueue.controller;

import documents.aad.javaee.test_project.mediqueue.dto.NotificationDto;
import documents.aad.javaee.test_project.mediqueue.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/sms-config")
public class SmsConfigController {


    @Autowired
    private NotificationService notificationService;



    @PostMapping("/save")
    public ResponseEntity<?> saveSmsConfig(@RequestBody Map<String, String> config) {
        String apiKey = config.get("apiKey");
        String senderId = config.get("senderId");
        String template = config.get("template");

        System.out.println("Saving SMS Config:");
        System.out.println("API Key: " + apiKey);
        System.out.println("Sender ID: " + senderId);
        System.out.println("Template: " + template);

        return ResponseEntity.ok(Map.of("message", "SMS configuration saved successfully!"));
    }

    @GetMapping("/logs") // URL: GET /api/v1/admin/sms-config/logs
    public ResponseEntity<List<NotificationDto>> getSmsLogs() {
        List<NotificationDto> logs = notificationService.getAllNotifications();
        return ResponseEntity.ok(logs);
    }
}