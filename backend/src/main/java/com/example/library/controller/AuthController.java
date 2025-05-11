@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");

        Optional<Student> student = studentRepo.findAll()
            .stream().filter(s -> s.getEmail().equals(email)).findFirst();

        if (student.isPresent()) {
            // Compare passwords (hash if stored hashed)
            if (student.get().getPassword().equals(password)) {
                String token = jwtUtil.generateToken(email);
                return ResponseEntity.ok(Map.of("token", token));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}

