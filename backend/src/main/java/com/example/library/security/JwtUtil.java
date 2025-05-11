@Component
public class JwtUtil {
    private final String SECRET_KEY = "your_secret_key_here"; // Store securely

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(Date.from(LocalDateTime.now().plusDays(7)
                        .atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes())
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            extractUsername(token); // If no exception → valid
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

