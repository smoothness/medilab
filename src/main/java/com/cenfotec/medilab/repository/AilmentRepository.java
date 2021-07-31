package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Ailment;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ailment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AilmentRepository extends JpaRepository<Ailment, Long> {
    @Query(
        value = "SELECT ailment.id, ailment.name, ailment.removed FROM ailment " +
        "inner join appointment_treatment_ailment " +
        "on appointment_treatment_ailment.ailment_id = ailment.id " +
        "inner join appointment " +
        "on appointment.id = appointment_treatment_ailment.appointment_id " +
        "where appointment.patient_id = :id",
        nativeQuery = true
    )
    List<Ailment> findAllPatientAilments(@Param("id") Long id);
}
