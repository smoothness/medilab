package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.MedicalExams;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

/**
 * Spring Data SQL repository for the MedicalExams entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MedicalExamsRepository extends JpaRepository<MedicalExams, Long> {
    @Query(value = "Select * from medical_exams where appointment_id = :id and removed = false",
        nativeQuery = true)
    List<MedicalExams> findMedicalExamsByAppointment(@Param("id") Long id);

    @Query(value = "Select medical_exams.id, medical_exams.name, medical_exams.description, medical_exams.removed, medical_exams.appointment_id " +
        " from medical_exams" +
        " INNER JOIN appointment" +
        " ON appointment.id = medical_exams.appointment_id" +
        " INNER JOIN patient" +
        " ON patient.id = appointment.patient_id" +
        " WHERE appointment.patient_id = :id " +
        " AND medical_exams.removed = false" +
        " AND  appointment.status = 'FINISHED'",
        nativeQuery = true)
    List<MedicalExams> findMedicalExamsByPatient(@Param("id") Long id);

    @Modifying
    @Query(value = "update medical_exams set removed = true where id = :id",
        nativeQuery = true)
    void deleteByRemoved(@Param("id") Long id);
}
