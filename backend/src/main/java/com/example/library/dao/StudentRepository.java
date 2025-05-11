public interface StudentRepository extends JpaRepository<Student, UUID> {
    boolean existsByEmail(String email);
}

