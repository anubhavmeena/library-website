@Entity
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String studentId;
    private String name;
    private String fatherName;
    private int age;
    private String phone;
    private String email;
    private String password;
    private int shiftHours;
    private LocalDate startDate;
    private LocalDate endDate;

    // Getters and setters
}
