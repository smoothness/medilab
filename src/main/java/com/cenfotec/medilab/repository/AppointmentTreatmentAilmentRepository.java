package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.AppointmentTreatmentAilment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the AppointmentTreatmentAilment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppointmentTreatmentAilmentRepository extends JpaRepository<AppointmentTreatmentAilment, Long> {

   @Query(value = "SELECT diagnosis.id, diagnosis.ailment_id, diagnosis.appointment_id," +
       " diagnosis.description, diagnosis.treatment_id, diagnosis.removed" +
       " FROM appointment_treatment_ailment as diagnosis" +
       " INNER JOIN appointment" +
       " ON appointment.id = diagnosis.appointment_id" +
       " INNER JOIN patient \n" +
       " ON patient.id = appointment.patient_id " +
       " WHERE appointment.status = 'FINISHED' " +
       " AND patient.id = :id" +
       " AND diagnosis.removed = false",
   nativeQuery = true)
   List<AppointmentTreatmentAilment> findAllDiagnosisByPatient(@Param("id") Long id);
}
