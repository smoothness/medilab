package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Patient;
import java.util.Optional;
import javax.swing.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Patient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    @Query(value = "SELECT * from patient where internal_user_id = :id", nativeQuery = true)
    Patient findByInternalUser(@Param("id") Long id);
}
