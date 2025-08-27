package documents.aad.javaee.test_project.mediqueue.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthTipDto {
    private Long id;
    private String title;
    private String content;
    private String language;
}
