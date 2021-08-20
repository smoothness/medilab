package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Treatment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the Treatment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Long> {
    @Query(value = "SELECT treatment.id, treatment.duration, treatment.medicines, treatment.removed, treatment.specifications" +
        " FROM treatment" +
        " INNER JOIN appointment_treatment_ailment AS diagnosis" +
        " ON diagnosis.treatment_id = treatment.id" +
        " INNER JOIN ailment" +
        " ON ailment.id = diagnosis.ailment_id" +
        " WHERE ailment.id = :ailment" +
        " AND diagnosis.appointment_id = :appointment" +
        " AND diagnosis.removed = false" +
        " AND treatment.removed = false" +
        " order by treatment.id desc",
    nativeQuery = true)
    List<Treatment> findAllTreatmentsByAilment(@Param("ailment") Long ailment, @Param("appointment") Long appointment);

    @Transactional
    @Modifying
    @Query(value = "UPDATE treatment SET removed = true WHERE id = :id", nativeQuery = true)
    void updateRemoved(@Param("id") Long id);
}
