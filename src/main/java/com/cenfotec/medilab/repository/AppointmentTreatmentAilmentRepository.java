package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.AppointmentTreatmentAilment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data SQL repository for the AppointmentTreatmentAilment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppointmentTreatmentAilmentRepository extends JpaRepository<AppointmentTreatmentAilment, Long> {

   @Query(value = "SELECT DISTINCT diagnosis.ailment_id, " +
       " diagnosis.id, diagnosis.appointment_id, diagnosis.description, diagnosis.treatment_id, diagnosis.removed" +
       " FROM appointment_treatment_ailment as diagnosis" +
       " INNER JOIN appointment" +
       " ON appointment.id = diagnosis.appointment_id" +
       " INNER JOIN patient" +
       " ON patient.id = appointment.patient_id " +
       " WHERE appointment.status = 'FINISHED' " +
       " AND patient.id = :id" +
       " AND diagnosis.removed = false" +
       " GROUP BY diagnosis.ailment_id",
   nativeQuery = true)
   List<AppointmentTreatmentAilment> findAllDiagnosisByPatient(@Param("id") Long id);


    @Query(value = "SELECT DISTINCT diagnosis.ailment_id," +
        " diagnosis.id, diagnosis.appointment_id, diagnosis.description, diagnosis.treatment_id, diagnosis.removed" +
        " FROM appointment_treatment_ailment as diagnosis" +
        " INNER JOIN appointment" +
        " ON appointment.id = diagnosis.appointment_id" +
        " WHERE appointment.id = :id" +
        " AND diagnosis.removed = false" +
        " GROUP BY diagnosis.ailment_id",
        nativeQuery = true)
    List<AppointmentTreatmentAilment> findAllDiagnosisByAppointment(@Param("id") Long id);

    @Transactional
    @Modifying
    @Query(value = "delete from appointment_treatment_ailment where ailment_id = :ailmentId AND appointment_id = :appointmentId", nativeQuery = true)
    void deleteByAilmentAndAppointment(@Param("ailmentId") Long ailmentId, @Param("appointmentId") Long appointmentId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE appointment_treatment_ailment" +
        " SET treatment_id = null where treatment_id = :treatmentId ", nativeQuery = true)
    void deleteByTreatment(@Param("treatmentId") Long treatmentId);
}
