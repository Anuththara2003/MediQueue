package documents.aad.javaee.test_project.mediqueue.service;


import documents.aad.javaee.test_project.mediqueue.entity.Token;
import documents.aad.javaee.test_project.mediqueue.repostry.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationSchedulerService {

    private final TokenRepository tokenRepository;
    private final SmsService smsService;

    private static final int NOTIFICATION_THRESHOLD = 5;


    @Scheduled(fixedRate = 60000)
    @Transactional
    public void sendApproachingTokenNotifications() {
        System.out.println("Checking for tokens to notify...");


        List<Token> tokensToNotify = tokenRepository.findApproachingTokensInActiveQueues(NOTIFICATION_THRESHOLD);

        if (tokensToNotify.isEmpty()) {
            System.out.println("No new tokens to notify at this time.");
            return;
        }

        System.out.println("Found " + tokensToNotify.size() + " tokens to notify.");


        for (Token token : tokensToNotify) {
            try {

                if (!token.isApproachingNotified()) {

                    smsService.sendApproachingSms(token);


                    token.setApproachingNotified(true);
                    tokenRepository.save(token);

                    System.out.println("Successfully sent notification for Token ID: " + token.getId());
                }
            } catch (Exception e) {
                System.err.println("Failed to send notification for Token ID: " + token.getId() + ". Error: " + e.getMessage());
            }
        }
    }
}