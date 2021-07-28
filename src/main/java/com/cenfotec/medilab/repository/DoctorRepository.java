package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Doctor;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Doctor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query(value = "SELECT * from doctor where internal_user_id = :id", nativeQuery = true)
    Doctor findByInternalUser(@Param("id") Long id);
}
