@RestController
@RequestMapping("/api")
public class RazorpayController {

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject options = new JSONObject();
        options.put("amount", data.get("amount")); // in paise
        options.put("currency", "INR");
        options.put("receipt", "order_rcptid_" + UUID.randomUUID());

        Order order = client.orders.create(options);
        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", order.get("id"));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/payment-success")
    public ResponseEntity<?> handlePayment(@RequestBody Map<String, Object> data) {
        try {
            // Save student
            String studentId = "LIB" + System.currentTimeMillis();
            String randomPass = UUID.randomUUID().toString().substring(0, 8);

            Student s = new Student();
            s.setStudentId(studentId);
            s.setName((String) data.get("name"));
            s.setFatherName((String) data.get("fatherName"));
            s.setAge(Integer.parseInt(data.get("age").toString()));
            s.setPhone((String) data.get("phone"));
            s.setEmail((String) data.get("email"));
            s.setPassword(randomPass); // Store hashed in production
            s.setShiftHours(Integer.parseInt(data.get("shiftHours").toString()));
            s.setStartDate(LocalDate.now());
            s.setEndDate(LocalDate.now().plusMonths(1));

            studentRepo.save(s);

            // Send email
            sendEmail(s.getEmail(), s.getStudentId(), randomPass);
            return ResponseEntity.ok("Student registered and credentials emailed.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed: " + e.getMessage());
        }
    }

    private void sendEmail(String to, String studentId, String password) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Library Registration - Login Credentials");
        msg.setText(String.format(
            "Welcome!\n\nYour account has been created.\nStudent ID: %s\nUsername: %s\nPassword: %s\n\nThank you!",
            studentId, to, password
        ));
        mailSender.send(msg);
    }
}

