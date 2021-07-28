package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.EmergencyContact;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the EmergencyContact entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {

    @Query(value = "SELECT * from emergency_contact where patient_id = :id", nativeQuery = true)
    List<EmergencyContact> findByPatientId(@Param("id") Long id);
}


